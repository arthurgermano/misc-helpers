/**
 * @fileoverview Fornece uma função para validar códigos de RENAVAM.
 */

/**
 * Array de pesos utilizado no cálculo do dígito verificador do RENAVAM.
 * @private
 * @type {number[]}
 */
const RENAVAM_WEIGHTS = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3];

/**
 * Valida um código de RENAVAM (Registro Nacional de Veículos Automotores).
 *
 * @summary Valida um código de RENAVAM.
 * @description A função valida o formato de 11 dígitos (preenchendo com zeros se
 * necessário) e calcula o dígito verificador para confirmar sua validade.
 *
 * @param {string | number} renavam O código a ser validado.
 * @returns {boolean} Retorna `true` se o RENAVAM for válido, e `false` caso contrário.
 */
function validateRENAVAM(renavam = "") {
  const digitsOnly = String(renavam).replace(/[^\d]/g, "").padStart(11, "0");

  if (digitsOnly.length !== 11 || /^(\d)\1{10}$/.test(digitsOnly)) {
    return false;
  }

  const base = digitsOnly.substring(0, 10);
  const verifierDigit = Number(digitsOnly[10]);

  const reversedBase = base.split("").reverse();

  const sum = reversedBase.reduce(
    (acc, digit, index) => acc + Number(digit) * RENAVAM_WEIGHTS[index],
    0
  );

  const remainder = sum % 11;
  const calculatedDigit = remainder <= 1 ? 0 : 11 - remainder;

  return verifierDigit === calculatedDigit;
}

// ------------------------------------------------------------------------------------------------
export default validateRENAVAM;
// ------------------------------------------------------------------------------------------------
