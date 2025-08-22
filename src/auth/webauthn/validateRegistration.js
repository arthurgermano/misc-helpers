/**
 * @file Módulo otimizado para validação de credencial de registro WebAuthn.
 * @author Seu Nome <seu.email@example.com>
 * @version 2.0.0
 */

const base64ToBuffer = require("../../utils/base64ToBuffer");
const cbor = require("cbor-x");

// ------------------------------------------------------------------------------------------------

/**
 * Valida uma credencial de registro WebAuthn de forma eficiente.
 *
 * Esta função executa uma série de validações em um fluxo único e otimizado:
 * 1. Valida a estrutura e as propriedades essenciais da credencial.
 * 2. Valida os parâmetros da requisição (challenge, origin, type) contra os valores esperados.
 * 3. Decodifica e valida o formato e a declaração do objeto de atestado.
 *
 * @param {object} credential - A credencial WebAuthn a ser validada.
 * @param {object} [expectedProps={}] - Um objeto contendo as propriedades esperadas para a validação.
 * @param {string} [expectedProps.challenge] - O challenge esperado, conforme enviado ao cliente.
 * @param {string} [expectedProps.origin] - A origem (domínio) esperada da requisição.
 * @param {string} [expectedProps.type] - O tipo de operação esperado (ex: 'webauthn.create').
 * @returns {true} Retorna `true` se a credencial for válida em todos os aspectos.
 * @throws {Error} Lança um erro descritivo no primeiro ponto em que a validação falhar.
 */
function validateRegistration(credential, expectedProps = {}) {
  // ## 1. Validação Estrutural da Credencial
  // Garante que o objeto da credencial e suas propriedades fundamentais existem e são do tipo correto.
  if (!credential) {
    throw new Error("Missing credential");
  }
  if (!credential.id) {
    throw new Error("Missing credential ID");
  }
  if (!credential.rawId) {
    throw new Error("Missing credential rawId");
  }
  if (!credential.type || credential.type !== "public-key") {
    throw new Error(
      "Missing credential type or credential type is not public-key"
    );
  }

  // ## 2. Validação dos Parâmetros da Requisição (Client Data)
  // Compara os dados da requisição (challenge, origin, type) com os valores esperados.
  const clientDataJSON = JSON.parse(credential.response.clientDataJSONDecoded);

  if (expectedProps.challenge !== clientDataJSON?.challenge) {
    throw new Error(
      `Challenge does not match. Provided challenge: ${
        clientDataJSON?.challenge ?? "none"
      }.`
    );
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

  // ## 3. Validação do Objeto de Atestado (Attestation Object)
  // Decodifica e valida o formato e a declaração de atestado.
  const attestationObjectBuffer = base64ToBuffer(
    credential.response.attestationObject
  );
  // A biblioteca `cbor.decode` é altamente otimizada para essa operação.
  const attestationObject = cbor.decode(new Uint8Array(attestationObjectBuffer));

  if (!attestationObject.fmt) {
    throw new Error("Missing attestation object format");
  }

  // Para o formato 'none', a declaração de atestado (attStmt) deve estar vazia.
  // A biblioteca cbor-x decodifica mapas CBOR em objetos Map do JS, que possuem a propriedade `.size`.
  if (attestationObject.fmt === "none") {
    if (attestationObject.attStmt && attestationObject.attStmt.size > 0) {
      throw new Error("None attestation had unexpected attestation statement");
    }
  } else {
    // Atualmente, apenas o formato 'none' é suportado por esta validação.
    throw new Error(`Unsupported Attestation Format: ${attestationObject.fmt}`);
  }

  // Se todas as validações passarem, a função retorna `true`.
  return true;
}

// ------------------------------------------------------------------------------------------------

module.exports = validateRegistration;

// ------------------------------------------------------------------------------------------------
