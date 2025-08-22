/**
 * @fileoverview Fornece uma função para verificar se um valor é um número finito.
 */

/**
 * Verifica se um valor fornecido é um número finito.
 *
 * @summary Verifica se um valor é um número real e finito.
 * @description Esta função determina se o valor fornecido é do tipo `number` e não é
 * `NaN`, `Infinity` ou `-Infinity`. Diferente de outras verificações como `!isNaN()`,
 * esta função não tenta converter a entrada para um número, sendo mais rigorosa e segura.
 *
 * @param {*} value - O valor a ser verificado.
 * @returns {boolean} Retorna `true` se o valor for um número finito; caso contrário, `false`.
 * @example
 * // Casos verdadeiros
 * isNumber(123);      // true
 * isNumber(-1.23);    // true
 * isNumber(0);        // true
 *
 * // Casos falsos
 * isNumber(Infinity); // false
 * isNumber(NaN);      // false
 * isNumber('123');    // false (não converte string)
 * isNumber(null);     // false
 * isNumber({});       // false
 */
function isNumber(value) {
  // A função estática Number.isFinite() já realiza as três verificações do código
  // original de forma nativa:
  // 1. Garante que o tipo seja 'number'.
  // 2. Garante que não seja NaN.
  // 3. Garante que não seja Infinity ou -Infinity.
  return Number.isFinite(value);
}

// ------------------------------------------------------------------------------------------------
module.exports = isNumber;
// ------------------------------------------------------------------------------------------------