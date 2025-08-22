const toString = require("./toString");
const base64To = require("./base64To");

// ------------------------------------------------------------------------------------------------

/**
 * @file Utilitário para codificação no formato Base64URL.
 * @author Seu Nome <seu.email@example.com>
 * @version 2.0.0
 */

/**
 * @summary Codifica uma entrada para o formato Base64URL.
 *
 * @description
 * Esta função converte qualquer valor de entrada para uma string no formato Base64URL.
 * O Base64URL é uma variação do Base64 padrão, segura para uso em URLs e nomes de arquivo,
 * pois substitui os caracteres `+` e `/` por `-` e `_`, respectivamente, e omite o
 * preenchimento final (`=`). A função é cross-environment, funcionando em Node.js e navegadores.
 *
 * @param {*} [text=""] - O valor a ser codificado. Será convertido para string antes do processo.
 * @param {BufferEncoding} [fromFormat="utf8"] - **(Apenas Node.js)** A codificação da entrada,
 * se for uma string em um formato diferente de UTF-8 (ex: 'hex').
 *
 * @returns {string} A string resultante no formato Base64URL.
 *
 * @example
 * // A string "subjects?_id=1&_id=2" contém caracteres que não são seguros em URLs.
 * const queryString = 'subjects?_id=1&_id=2';
 * const encodedQuery = base64URLEncode(queryString);
 * console.log(encodedQuery); // "c3ViamVjdHM_X2lkPTEmX2lkPTI"
 *
 * // A saída pode ser usada com segurança em uma URL:
 * // https://example.com/q=c3ViamVjdHM_X2lkPTEmX2lkPTI
 */
function base64URLEncode(text = "", fromFormat = "utf8") {
  // 1. Delega a conversão para string e a codificação Base64 para a função `base64To`.
  // A função `base64To` já lida com diferentes tipos de entrada e remove o preenchimento (`=`).
  const standardBase64 = base64To(toString(text), fromFormat);

  // 2. Converte a saída do Base64 padrão para o formato URL-safe.
  // Substitui os caracteres '+' por '-' e '/' por '_'.
  return standardBase64.replace(/\+/g, "-").replace(/\//g, "_");
}

// ------------------------------------------------------------------------------------------------

module.exports = base64URLEncode;