/**
 * @file Módulo otimizado para validação de asserção de autenticação WebAuthn.
 */

import verifySignature from "../../crypto/verifySignature";
import importCryptoKey from "../../crypto/importCryptoKey";
import validateRPID from "./validateRPID";
import isNumber from "../../helpers/isNumber";
import base64ToBuffer from "../../utils/base64ToBuffer";
import base64From from "../../utils/base64From";
import bufferConcatenate from "../../utils/bufferConcatenate";
import convertECDSAASN1Signature from "./convertECDSAASN1Signature";

// ------------------------------------------------------------------------------------------------
/**
 * Recupera os parâmetros do algoritmo para importar uma chave pública com base no identificador do algoritmo.
 * @private
 */
function getImportPublicKeyAlgorithm(publicKeyAlgorithm) {
  switch (publicKeyAlgorithm) {
    case -7: // ES256
      return { name: "ECDSA", namedCurve: "P-256" };
    case -257: // RS256
      return { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } };
    case -8: // Ed25519
      throw new Error("Ed25519 is not supported by crypto.subtle directly");
    default:
      throw new Error(`Unsupported algorithm: ${publicKeyAlgorithm}`);
  }
}

/**
 * Recupera os parâmetros do algoritmo para verificar uma assinatura com base no identificador do algoritmo.
 * @private
 */
function getAlgorithmVerifySignatureParam(publicKeyAlgorithm) {
  switch (publicKeyAlgorithm) {
    case -7: // ES256
      return { name: "ECDSA", hash: { name: "SHA-256" } };
    case -257: // RS256
      return { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } };
    case -8: // Ed25519
      throw new Error(
        "Ed25519 is not supported by crypto.subtle. Use an external library."
      );
    default:
      throw new Error(`Unsupported algorithm: ${publicKeyAlgorithm}`);
  }
}

/**
 * Gera um hash combinado a partir dos dados do autenticador e do clientDataJSON da asserção.
 * Este é o payload que foi originalmente assinado pelo autenticador.
 * @private
 */
async function generateDataToVerify(assertion) {
  const authenticatorDataBuffer = base64ToBuffer(
    assertion.response.authenticatorData
  );
  const clientDataJSONBuffer = base64ToBuffer(assertion.response.clientDataJSON);
  const clientDataJSONHash = await crypto.subtle.digest(
    "SHA-256",
    clientDataJSONBuffer
  );

  return bufferConcatenate(authenticatorDataBuffer, clientDataJSONHash);
}

// ------------------------------------------------------------------------------------------------
/**
 * Valida de forma assíncrona uma asserção de autenticação WebAuthn em um fluxo otimizado.
 *
 * @param {object} credential - O objeto da credencial armazenado, contendo a chave pública.
 * @param {object} assertion - A asserção de autenticação recebida do cliente.
 * @param {object} [expectedProps={}] - Propriedades esperadas para validação (challenge, origin, etc.).
 * @param {object} [incomingProps={}] - Propriedades recebidas na requisição (contador da asserção).
 * @param {object} [publicKeyProps={}] - Opções para a importação da chave pública.
 * @param {boolean} [convertECDSignature=true] - Se deve converter a assinatura ECDSA do formato bruto para ASN.1.
 * @returns {Promise<boolean>} Retorna `true` se a validação for bem-sucedida.
 * @throws {Error} Lança um erro detalhado na primeira falha de validação.
 */
async function validateAuthentication(
  credential,
  assertion,
  expectedProps = {},
  incomingProps = {},
  publicKeyProps = {},
  convertECDSignature = true
) {
  // ## 1. Validação Estrutural dos Objetos
  if (!credential) {
    throw new Error("Missing credential");
  }
  if (!credential.id) {
    throw new Error("Missing credential ID");
  }
  if (!credential.rawId) {
    throw new Error("Missing credential rawId");
  }
  if (credential.type !== "public-key") {
    throw new Error("Credential type must be 'public-key'");
  }

  if (!assertion) {
    throw new Error("Missing assertion");
  }
  if (!assertion.id) {
    throw new Error("Missing assertion ID");
  }
  if (!assertion.rawId) {
    throw new Error("Missing assertion rawId");
  }
  if (assertion.type !== "public-key") {
    throw new Error("Assertion type must be 'public-key'");
  }

  // ## 2. Validação de Consistência entre Credencial e Asserção
  if (credential.id !== assertion.id) {
    throw new Error("Credential ID does not match assertion ID");
  }
  if (credential.rawId !== assertion.rawId) {
    throw new Error("Credential rawId does not match assertion rawId");
  }

  // ## 3. Validação do Contador de Assinatura (Prevenção de Replay/Clonagem)
  const { counterCredential } = expectedProps;
  const { counterAssertion } = incomingProps;
  if (!isNumber(counterCredential) || counterCredential < 0) {
    throw new Error("counterCredential must be a number >= 0");
  }
  if (!isNumber(counterAssertion) || counterAssertion < 0) {
    throw new Error("counterAssertion must be a number >= 0");
  }
  // A especificação WebAuthn exige que o contador da nova asserção seja maior que o contador armazenado.
  // Isso previne ataques de repetição e detecta clonagem de autenticadores.
  // Uma exceção é quando um autenticador não suporta contadores e sempre retorna 0.
  // A lógica abaixo acomoda este cenário: a verificação só é imposta se o novo contador for diferente de zero.
  if (counterAssertion !== 0) {
    if (counterAssertion <= counterCredential) {
      throw new Error(
        `Invalid signature counter. The assertion counter (${counterAssertion}) must be strictly greater than the stored credential counter (${counterCredential}).`
      );
    }
  }

  // ## 4. Validação dos Parâmetros da Requisição (Client Data)
  const clientDataJSON = JSON.parse(assertion.response.clientDataJSONDecoded);
  const assertionChallenge = base64From(clientDataJSON?.challenge || "");
  if (expectedProps.challenge !== assertionChallenge) {
    throw new Error("Challenge provided does not match assertion challenge.");
  }
  if (expectedProps.origin !== clientDataJSON?.origin) {
    throw new Error(
      `Origin does not match. Expected: ${expectedProps.origin} Actual: ${
        clientDataJSON?.origin ?? "none"
      }`
    );
  }
  if (expectedProps.type !== clientDataJSON?.type) {
    throw new Error(
      `Type does not match. Expected: ${expectedProps.type} Actual: ${
        clientDataJSON?.type ?? "none"
      }`
    );
  }

  // ## 5. Validação das Flags do Autenticador
  if (!assertion.authData.flags.up) {
    throw new Error("User Present flag (up) is required for authentication.");
  }
  if (!assertion.authData.flags.uv) {
    throw new Error("User Verified flag (uv) is required for authentication.");
  }

  // ## 6. Validação do RP ID
  await validateRPID(expectedProps.rpID, assertion.authData.rpIdHash);

  // ## 7. Verificação da Assinatura Criptográfica
  const importAlgo = getImportPublicKeyAlgorithm(
    credential.response.publicKeyAlgorithm
  );
  const verifyAlgo = getAlgorithmVerifySignatureParam(
    credential.response.publicKeyAlgorithm
  );

  const publicKey = await importCryptoKey(
    publicKeyProps?.importKey?.format || "spki",
    base64ToBuffer(credential.response.publicKey),
    importAlgo,
    publicKeyProps?.importKey?.extractable || false,
    ["verify"]
  );

  let signature = new Uint8Array(base64ToBuffer(assertion.response.signature));
  // Assinaturas ECDSA de autenticadores vêm em formato bruto (r||s), mas a Web Crypto API espera ASN.1.
  if (convertECDSignature && credential.response.publicKeyAlgorithm === -7) {
    signature = convertECDSAASN1Signature(signature);
  }

  const dataToVerify = await generateDataToVerify(assertion);

  return verifySignature(verifyAlgo, publicKey, signature, dataToVerify);
}

// ------------------------------------------------------------------------------------------------

export default validateAuthentication;

// ------------------------------------------------------------------------------------------------
