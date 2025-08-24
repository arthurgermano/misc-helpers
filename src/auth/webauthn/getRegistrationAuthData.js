/**
 * @file Módulo para processar e extrair dados de uma credencial de registro WebAuthn.
 */

import { decode } from "cbor-x";
import base64FromBuffer from "../../utils/base64FromBuffer";

// ------------------------------------------------------------------------------------------------

/**
 * Analisa o buffer de dados do autenticador (authData) para extrair o ID da credencial e a chave pública.
 * A estrutura do buffer `authData` é rigorosamente definida pela especificação WebAuthn.
 * Esta função decodifica essa estrutura de bytes.
 * @see https://www.w3.org/TR/webauthn-2/#sctn-authenticator-data
 *
 * @private
 * @param {ArrayBuffer} attestationObjectBuffer - O buffer do objeto de atestado, que contém os dados do autenticador.
 * @returns {{credentialId: string, publicKeyObject: string}} Um objeto contendo o ID da credencial e a chave pública, ambos codificados em Base64.
 */
function parseAuthenticatorData(attestationObjectBuffer) {
  // 1. Decodifica o objeto de atestado do formato CBOR para acessar seus campos internos.
  const attestationObject = decode(new Uint8Array(attestationObjectBuffer));
  const { authData } = attestationObject;

  // 2. Define constantes para os offsets e comprimentos dos campos na estrutura `authData`,
  // conforme a especificação. Isso substitui "números mágicos" por valores claros e documentados.
  const RP_ID_HASH_OFFSET = 0;
  const RP_ID_HASH_LENGTH = 32;
  const FLAGS_OFFSET = RP_ID_HASH_OFFSET + RP_ID_HASH_LENGTH; // 32
  const FLAGS_LENGTH = 1;
  const SIGN_COUNT_OFFSET = FLAGS_OFFSET + FLAGS_LENGTH; // 33
  const SIGN_COUNT_LENGTH = 4;

  // O `attestedCredentialData` é opcional e sua presença é indicada pelo bit 'AT' nas flags.
  // Seu início é após os campos de cabeçalho.
  const ATTESTED_CREDENTIAL_DATA_OFFSET = SIGN_COUNT_OFFSET + SIGN_COUNT_LENGTH; // 37
  const AAGUID_LENGTH = 16;
  const CREDENTIAL_ID_LENGTH_BYTES = 2;

  const CREDENTIAL_ID_LENGTH_OFFSET =
    ATTESTED_CREDENTIAL_DATA_OFFSET + AAGUID_LENGTH; // 53
  const CREDENTIAL_ID_OFFSET =
    CREDENTIAL_ID_LENGTH_OFFSET + CREDENTIAL_ID_LENGTH_BYTES; // 55

  // 3. Extrai o comprimento do ID da credencial. Este é um inteiro de 2 bytes (Big Endian).
  // Usamos um DataView para garantir a interpretação correta dos bytes.
  const idLenBytes = authData.slice(
    CREDENTIAL_ID_LENGTH_OFFSET,
    CREDENTIAL_ID_OFFSET
  );
  const dataView = new DataView(idLenBytes.buffer);
  const credentialIdLength = dataView.getUint16(0);

  // 4. Extrai o ID da credencial e a chave pública usando os comprimentos e offsets calculados.
  const credentialId = authData.slice(
    CREDENTIAL_ID_OFFSET,
    CREDENTIAL_ID_OFFSET + credentialIdLength
  );
  const publicKeyBytes = authData.slice(
    CREDENTIAL_ID_OFFSET + credentialIdLength
  );

  // 5. Retorna os dados extraídos, codificados em Base64 para facilitar o transporte e armazenamento.
  return {
    credentialId: base64FromBuffer(credentialId.buffer),
    publicKeyObject: base64FromBuffer(publicKeyBytes.buffer),
  };
}

// ------------------------------------------------------------------------------------------------

/**
 * Extrai e formata os dados de autenticação de registro de uma credencial WebAuthn (`PublicKeyCredential`).
 * A função processa os vários `ArrayBuffer`s da credencial, convertendo-os para formatos úteis (como Base64)
 * e decodificando a estrutura de dados interna do autenticador.
 *
 * @param {PublicKeyCredential} credential - O objeto de credencial WebAuthn retornado pelo navegador após um registro bem-sucedido.
 * @returns {object} Um objeto estruturado contendo os dados de registro prontos para serem enviados a um servidor.
 * @throws {Error} Lança um erro se ocorrer um problema durante o processamento da credencial (ex: formato inválido).
 */
function getRegistrationAuthData(credential) {
  const response = credential.response;

  // Analisa a estrutura de bytes do `attestationObject` para extrair dados internos.
  const parsedAuthData = parseAuthenticatorData(response.attestationObject);

  // Decodifica o `clientDataJSON` de ArrayBuffer para uma string UTF-8 legível.
  const clientDataJSONDecoded = new TextDecoder().decode(
    response.clientDataJSON
  );

  // Constrói o objeto de retorno final com todos os dados relevantes convertidos para Base64.
  // Isso prepara os dados para serem serializados (ex: como JSON) e enviados para o servidor.
  return {
    // Dados de nível superior da credencial
    rawId: base64FromBuffer(credential.rawId),
    id: credential.id,
    type: credential.type,
    authenticatorAttachment: credential.authenticatorAttachment,
    clientExtensionResults: credential.getClientExtensionResults(),

    // Dados extraídos e analisados do `authData`
    authData: parsedAuthData,

    // Dados da resposta do autenticador, convertidos para formatos apropriados
    response: {
      attestationObject: base64FromBuffer(response.attestationObject),
      authenticatorData: base64FromBuffer(response.getAuthenticatorData()),
      clientDataJSON: base64FromBuffer(response.clientDataJSON),
      clientDataJSONDecoded,
      transports: response.getTransports() || [],
      publicKey: base64FromBuffer(response.getPublicKey()),
      publicKeyAlgorithm: response.getPublicKeyAlgorithm(),
    },
  };
}

// ------------------------------------------------------------------------------------------------

export default getRegistrationAuthData;

// ------------------------------------------------------------------------------------------------
