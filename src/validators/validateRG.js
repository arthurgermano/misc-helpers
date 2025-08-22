/**
 * @fileoverview Fornece uma função para validar números de RG (Registro Geral) brasileiro.
 */

/**
 * Pesos para o cálculo do dígito verificador do RG.
 * Os fatores multiplicadores crescem da esquerda para a direita, iniciando em 2.
 * @private
 */
const RG_WEIGHTS = [2, 3, 4, 5, 6, 7, 8, 9];

/**
 * Valida um número de RG (Registro Geral) brasileiro.
 *
 * @summary Valida um número de RG brasileiro usando o algoritmo de módulo 11.
 * @description A função valida o formato de 8 dígitos seguido por um dígito verificador,
 * que pode ser um número (0-9) ou a letra 'X' quando o cálculo resulta em 10.
 * Remove automaticamente pontuação e formatação do input.
 *
 * @param {string | number} rg O número do RG a ser validado (com ou sem formatação).
 * @returns {boolean} Retorna `true` se o RG for válido, e `false` caso contrário.
 *
 * @example
 * validateRG('24.678.131-4'); // true
 * validateRG('37.606.335-X'); // true
 * validateRG('45.727.503-0'); // true
 * validateRG('123456789'); // false
 * validateRG('24678131X'); // false (dígito verificador incorreto)
 */
function validateRG(rg = "") {
  // Verifica se o parâmetro é nulo ou indefinido
  if (rg == null) {
    return false;
  }

  // Remove toda formatação, mantendo apenas números e a letra X
  const cleanRG = String(rg)
    .toUpperCase()
    .replace(/[^\dX]/g, "");

  // RG deve ter exatamente 9 caracteres (8 dígitos + 1 verificador)
  if (cleanRG.length !== 9) {
    return false;
  }

  // Extrai os 8 primeiros dígitos (base) e o dígito verificador
  const base = cleanRG.substring(0, 8);
  const verifierDigit = cleanRG.substring(8);

  // Verifica se a base contém apenas dígitos
  if (!/^\d{8}$/.test(base)) {
    return false;
  }

  // Verifica se o dígito verificador é válido (0-9 ou X)
  if (!/^[\dX]$/.test(verifierDigit)) {
    return false;
  }

  // Verifica se todos os dígitos da base são iguais (RG inválido por convenção)
  if (/^(\d)\1{7}$/.test(base)) {
    return false;
  }

  // --- Cálculo do dígito verificador usando módulo 11 ---
  
  // Multiplica cada dígito pelo seu peso correspondente
  const sum = base
    .split("")
    .reduce((acc, digit, index) => {
      return acc + (Number(digit) * RG_WEIGHTS[index]);
    }, 0);

  // Calcula o resto da divisão por 11
  const remainder = sum % 11;
  
  // Calcula o complemento (11 - resto)
  const complement = 11 - remainder;
  
  // Determina o dígito verificador calculado
  let calculatedDigit;
  
  if (complement === 10) {
    // Quando o complemento é 10, o dígito verificador é 'X'
    calculatedDigit = 'X';
  } else if (complement === 11) {
    // Quando o complemento é 11, o dígito verificador é '0'
    calculatedDigit = '0';
  } else {
    // Para outros casos, o dígito verificador é o próprio complemento
    calculatedDigit = String(complement);
  }

  // Compara o dígito calculado com o fornecido
  return calculatedDigit === verifierDigit;
}

// ------------------------------------------------------------------------------------------------
module.exports = validateRG;
// ------------------------------------------------------------------------------------------------