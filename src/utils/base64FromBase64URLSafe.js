/**
 * @file Utilitário para conversão de Base64URL para Base64 padrão.
 */

/**
 * @summary Converte uma string do formato Base64URL para o formato Base64 padrão.
 *
 * @description
 * O formato Base64URL é uma variação do Base64 projetada para ser segura em URLs e nomes de arquivo.
 * Ele substitui os caracteres `+` e `/` por `-` e `_`, respectivamente, e geralmente omite o
 * preenchimento (`=`) no final da string.
 *
 * Esta função reverte essas substituições e restaura o preenchimento (`=`)
 * necessário para que a string seja uma representação Base64 válida, cujo comprimento
 * deve ser um múltiplo de 4.
 *
 * @param {string} [urlSafeBase64=""] - A string em formato Base64URL a ser convertida.
 *
 * @returns {string} A string convertida para o formato Base64 padrão.
 *
 * @example
 * // Exemplo com uma string que precisa de preenchimento
 * const urlSafeString = 'rqXRQrq_mSFhX4c2wSZJrA';
 * const standardBase64 = base64FromBase64URLSafe(urlSafeString);
 * console.log(standardBase64); // "rqXRQrq/mSFhX4c2wSZJrA=="
 *
 * // Exemplo com uma string que não precisa de preenchimento
 * const anotherUrlSafeString = 'Zm9vYg';
 * const anotherStandardBase64 = base64FromBase64URLSafe(anotherUrlSafeString);
 * console.log(anotherStandardBase64); // "Zm9vYg=="
 */
function base64FromBase64URLSafe(urlSafeBase64 = "") {
  // Validação explícita para garantir que a entrada é uma string não vazia.
  if (typeof urlSafeBase64 !== 'string' || urlSafeBase64.length === 0) {
    return "";
  }

  // 1. Substitui os caracteres específicos do Base64URL pelos do Base64 padrão.
  // O uso da flag /g garante que todas as ocorrências sejam substituídas.
  const base64 = urlSafeBase64.replace(/-/g, "+").replace(/_/g, "/");

  // 2. Calcula e adiciona o preenchimento ('=') de forma eficiente.
  // O método `padEnd` é mais performático e declarativo que um loop `while`.
  // Ele calcula quantos caracteres `=` são necessários e os adiciona de uma só vez.
  const requiredPadding = (4 - (base64.length % 4)) % 4;
  return base64.padEnd(base64.length + requiredPadding, "=");
}

// ------------------------------------------------------------------------------------------------

export default base64FromBase64URLSafe;