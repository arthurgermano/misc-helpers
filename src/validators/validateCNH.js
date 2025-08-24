/**
 * @fileoverview Fornece uma função para validar números de CNH.
 */

/**
 * Pesos para o cálculo do primeiro e segundo dígito verificador da CNH.
 * @private
 */
const CNH_WEIGHTS_DV1 = [9, 8, 7, 6, 5, 4, 3, 2, 1];
const CNH_WEIGHTS_DV2 = [1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * Valida um número de CNH (Carteira Nacional de Habilitação).
 *
 * @summary Valida um número de CNH.
 * @description A função verifica o formato, a regra de dígitos repetidos e calcula os
 * dois dígitos verificadores para confirmar a validade do número.
 *
 * @param {string | number} cnh O número da CNH a ser validado.
 * @returns {boolean} Retorna `true` se a CNH for válida, e `false` caso contrário.
 */
function validateCNH(cnh = "") {
  const digitsOnly = String(cnh).replace(/[^\d]/g, "");

  if (digitsOnly.length !== 11 || /^(\d)\1{10}$/.test(digitsOnly)) {
    return false;
  }

  const base = digitsOnly.substring(0, 9);
  const verifierDigits = digitsOnly.substring(9);

  // --- Cálculo do primeiro dígito ---
  const sum1 = base
    .split("")
    .reduce(
      (acc, digit, index) => acc + Number(digit) * CNH_WEIGHTS_DV1[index],
      0
    );

  const remainder1 = sum1 % 11;
  const calculatedDv1 = remainder1 >= 10 ? 0 : remainder1;

  if (calculatedDv1 !== Number(verifierDigits[0])) {
    return false;
  }

  // --- Cálculo do segundo dígito ---
  const sum2 = base
    .split("")
    .reduce(
      (acc, digit, index) => acc + Number(digit) * CNH_WEIGHTS_DV2[index],
      0
    );

  const remainder2 = sum2 % 11;
  const calculatedDv2 = remainder2 >= 10 ? 0 : remainder2;

  return calculatedDv2 === Number(verifierDigits[1]);
}

// ------------------------------------------------------------------------------------------------
export default validateCNH;
// ------------------------------------------------------------------------------------------------
