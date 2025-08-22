/**
 * @fileoverview Fornece uma função para validar números de PIS/PASEP/NIT.
 */

/**
 * Array de pesos utilizado no algoritmo de cálculo do dígito verificador.
 * @private
 * @type {number[]}
 */
const PIS_WEIGHTS = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

/**
 * Valida um número de PIS/PASEP/NIT.
 *
 * @summary Valida um número de PIS/PASEP/NIT.
 * @description A função verifica o formato, a regra de dígitos repetidos e o dígito
 * verificador para confirmar a validade do número.
 *
 * @param {string | number} pis O número a ser validado.
 * @returns {boolean} Retorna `true` se o número for válido, e `false` caso contrário.
 * @example
 * validatePISPASEPNIT("120.12345.67-8"); // true
 * validatePISPASEPNIT("11111111111");    // false
 */
function validatePISPASEPNIT(pis = "") {
  const digitsOnly = String(pis).replace(/[^\d]/g, "");

  if (digitsOnly.length !== 11 || /^(\d)\1{10}$/.test(digitsOnly)) {
    return false;
  }

  const base = digitsOnly.substring(0, 10);
  const verifierDigit = Number(digitsOnly[10]);

  const sum = base
    .split("")
    .reduce((acc, digit, index) => acc + Number(digit) * PIS_WEIGHTS[index], 0);

  const remainder = sum % 11;
  const calculatedDigit = remainder < 2 ? 0 : 11 - remainder;

  return verifierDigit === calculatedDigit;
}

// ------------------------------------------------------------------------------------------------
module.exports = validatePISPASEPNIT;
// ------------------------------------------------------------------------------------------------
