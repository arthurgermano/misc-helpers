/**
 * @fileoverview Fornece uma função para validar números de Título de Eleitor.
 */

/**
 * Pesos para o cálculo do primeiro dígito verificador.
 * @private
 */
const TITULO_WEIGHTS_DV1 = [2, 3, 4, 5, 6, 7, 8, 9];

/**
 * Valida um número de Título de Eleitor.
 *
 * @summary Valida um número de Título de Eleitor.
 * @description A função valida o formato de 12 dígitos e calcula ambos os dígitos
 * verificadores, considerando as regras especiais baseadas no estado de emissão.
 *
 * @param {string | number} titulo O número do título a ser validado.
 * @returns {boolean} Retorna `true` se o título for válido, e `false` caso contrário.
 */
function validateTituloEleitor(titulo = "") {
  // Verifica se o parâmetro é nulo ou indefinido
  if (titulo == null) {
    return false;
  }

  const digitsOnly = String(titulo).replace(/[^\d]/g, "").padStart(12, "0");

  if (digitsOnly.length !== 12) {
    return false;
  }

  const base = digitsOnly.substring(0, 8);
  const stateCode = Number(digitsOnly.substring(8, 10));
  const verifierDigits = digitsOnly.substring(10);

  // O código de estado deve ser válido (entre 1 e 28)
  if (stateCode < 1 || stateCode > 28) {
    return false;
  }

  // --- Cálculo do primeiro dígito verificador ---
  const sum1 = base
    .split("")
    .reduce(
      (acc, digit, index) => acc + Number(digit) * TITULO_WEIGHTS_DV1[index],
      0
    );

  let remainder1 = sum1 % 11;
  let calculatedDv1;

  // Regras para o primeiro DV baseadas na documentação oficial:
  // - Se resto for 0: para SP (01) e MG (02) é 1, para outros estados é 0
  // - Se resto for maior que 9: é 0
  // - Nos outros casos: é o próprio resto
  if (remainder1 === 0) {
    calculatedDv1 = (stateCode === 1 || stateCode === 2) ? 1 : 0;
  } else if (remainder1 > 9) {
    calculatedDv1 = 0;
  } else {
    calculatedDv1 = remainder1;
  }

  if (calculatedDv1 !== Number(verifierDigits[0])) {
    return false;
  }

  // --- Cálculo do segundo dígito verificador ---
  const digit1 = Number(digitsOnly.substring(8, 9)); // Primeiro dígito do código do estado
  const digit2 = Number(digitsOnly.substring(9, 10)); // Segundo dígito do código do estado
  
  const sum2 = (digit1 * 7) + (digit2 * 8) + (calculatedDv1 * 9);

  let remainder2 = sum2 % 11;
  let calculatedDv2;
  
  // Mesma lógica do primeiro dígito verificador.
  if (remainder2 === 0) {
    calculatedDv2 = (stateCode === 1 || stateCode === 2) ? 1 : 0;
  } else if (remainder2 > 9) {
    calculatedDv2 = 0;
  } else {
    calculatedDv2 = remainder2;
  }

  return calculatedDv2 === Number(verifierDigits[1]);
}

// ------------------------------------------------------------------------------------------------
export default validateTituloEleitor;
// ------------------------------------------------------------------------------------------------