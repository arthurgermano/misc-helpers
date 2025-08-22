/**
 * @fileoverview Fornece uma função para retornar um valor padrão caso o valor
 * principal seja nulo ou indefinido.
 */

/**
 * Retorna um valor padrão (`defaultValue`) se o valor verificado (`checkValue`) for `null` ou `undefined`.
 *
 * @summary Retorna um valor padrão para valores nulos ou indefinidos.
 * @description Esta função é um substituto seguro para o operador `||` em casos onde valores
 * como `0`, `false` ou `''` (string vazia) são considerados válidos e não devem ser
 * substituídos pelo valor padrão.
 *
 * @param {*} checkValue - O valor a ser verificado.
 * @param {*} defaultValue - O valor padrão a ser retornado caso `checkValue` seja `null` ou `undefined`.
 * @returns {*} Retorna `checkValue` se ele não for nulo ou indefinido; caso contrário, retorna `defaultValue`.
 * @example
 * // Casos de substituição
 * defaultValue(null, "padrão");       // Retorna "padrão"
 * defaultValue(undefined, 100);    // Retorna 100
 *
 * // Casos de não substituição (valores "falsy" válidos)
 * defaultValue(0, 10);               // Retorna 0
 * defaultValue("", "texto");         // Retorna ""
 * defaultValue(false, true);         // Retorna false
 *
 * // Caso com valor válido
 * defaultValue("olá", "mundo");      // Retorna "olá"
 */
function defaultValue(checkValue, defaultValue) {
  // O operador de coalescência nula (??) executa a mesma lógica da função original
  // de forma nativa, concisa e performática.
  return checkValue ?? defaultValue;
}

// ------------------------------------------------------------------------------------------------
module.exports = defaultValue;
// ------------------------------------------------------------------------------------------------
