/**
 * @fileoverview Fornece uma função para validar CEP (Código de Endereçamento Postal).
 */

/**
 * Valida um CEP (Código de Endereçamento Postal).
 *
 * @summary Valida um CEP.
 * @description A função verifica se a entrada consiste em exatamente 8 dígitos numéricos,
 * ignorando caracteres de máscara.
 *
 * @param {string | number} cep O CEP a ser validado.
 * @returns {boolean} Retorna `true` se o CEP for válido, e `false` caso contrário.
 * @example
 * validateCEP("80000-123"); // true
 * validateCEP("1234567");   // false
 */
function validateCEP(cep = "") {
  const digitsOnly = String(cep).replace(/[^\d]/g, "");
  return digitsOnly.length === 8;
}

// ------------------------------------------------------------------------------------------------
export default validateCEP;
// ------------------------------------------------------------------------------------------------
