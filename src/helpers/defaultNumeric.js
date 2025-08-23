/**
 * @fileoverview Fornece uma função para retornar um valor numérico válido ou um valor
 * padrão caso o valor principal seja inválido.
 */

/**
 * Retorna um valor numérico válido ou o valor padrão (`defaultValue`) caso o valor
 * verificado (`checkValue`) não seja um número finito ou seja menor que 1.
 *
 * @summary Retorna um valor numérico válido ou o valor padrão fornecido.
 * @description Esta função garante que o valor retornado seja um número inteiro, finito
 * e maior ou igual a 1. Caso contrário, retorna o valor padrão fornecido. É útil para
 * cenários onde limites, quantidades ou índices não podem ser negativos, nulos, NaN ou infinitos.
 *
 * @param {*} checkValue - O valor a ser verificado.
 * @param {number} defaultValue - O valor padrão a ser retornado caso `checkValue` seja inválido.
 * @returns {number} Retorna o número validado ou `defaultValue` caso `checkValue` seja inválido.
 * @example
 * // Casos de substituição
 * defaultNumeric("abc", 10);     // Retorna 10
 * defaultNumeric(NaN, 5);        // Retorna 5
 * defaultNumeric(-3, 1);         // Retorna 1
 * defaultNumeric(Infinity, 2);   // Retorna 2
 *
 * // Casos válidos
 * defaultNumeric(7, 1);          // Retorna 7
 * defaultNumeric("12", 1);       // Retorna 12
 * defaultNumeric(1.9, 1);        // Retorna 1 (arredondado para baixo)
 */
function defaultNumeric(checkValue, defaultValue) {
  const num = Number(checkValue);
  return Number.isFinite(num) && !isNaN(num) ? num : defaultValue;
}

// ------------------------------------------------------------------------------------------------
module.exports = defaultNumeric;
// ------------------------------------------------------------------------------------------------
