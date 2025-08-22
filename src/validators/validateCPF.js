/**
 * @fileoverview Fornece uma função para validar números de CPF (Cadastro de Pessoas Físicas).
 * O código é compatível com ambientes Node.js e navegadores.
 */

/**
 * Calcula um dígito verificador de CPF a partir de uma base de dígitos.
 * O algoritmo é o mesmo para o primeiro e o segundo dígito, variando apenas o tamanho da base.
 *
 * @private
 * @param {string} baseDigits - A sequência de dígitos para o cálculo (9 para o 1º dígito, 10 para o 2º).
 * @returns {number} O dígito verificador calculado.
 */
function _calculateVerifierDigit(baseDigits) {
  // O peso inicial é o tamanho da base + 1 (10 para o 1º dígito, 11 para o 2º).
  const initialWeight = baseDigits.length + 1;

  // Calcula a soma ponderada dos dígitos.
  const sum = baseDigits
    .split('')
    .reduce((acc, digit, index) => acc + (Number(digit) * (initialWeight - index)), 0);

  const remainder = sum % 11;

  // Se o resto da divisão for menor que 2, o dígito é 0; caso contrário, é 11 menos o resto.
  return remainder < 2 ? 0 : 11 - remainder;
}

/**
 * Valida um número de CPF (Cadastro de Pessoas Físicas).
 *
 * @summary Valida um CPF, numérico ou com máscara.
 * @description A função remove caracteres de máscara, verifica casos inválidos conhecidos
 * e calcula os dois dígitos verificadores para confirmar a validade do CPF.
 *
 * @param {string | number} cpf O número de CPF a ser validado.
 * @returns {boolean} Retorna `true` se o CPF for válido, e `false` caso contrário.
 * @example
 * validateCPF("123.456.789-00"); // Exemplo válido
 * validateCPF("111.111.111-11"); // Retorna false
 */
function validateCPF(cpf = "") {
  // 1. Normalização da Entrada
  const digitsOnly = String(cpf).replace(/[^\d]/g, '');

  const CPF_LENGTH = 11;

  // Rejeita a entrada se, após a limpeza, estiver vazia ou com mais de 11 dígitos.
  if (digitsOnly === '' || digitsOnly.length > CPF_LENGTH) {
    return false;
  }

  // Garante que a string tenha 11 dígitos, preenchendo com zeros à esquerda se necessário.
  const paddedCpf = digitsOnly.padStart(CPF_LENGTH, '0');

  // 2. Verificação de Casos Inválidos
  // CPFs com todos os dígitos iguais são inválidos. A regex /^(\d)\1{10}$/ checa essa condição.
  if (/^(\d)\1{10}$/.test(paddedCpf)) {
    return false;
  }

  // 3. Cálculo e Validação dos Dígitos
  const baseDv1 = paddedCpf.substring(0, 9);
  const expectedDv1 = _calculateVerifierDigit(baseDv1);

  // Compara o primeiro dígito verificador calculado com o fornecido.
  if (expectedDv1 !== Number(paddedCpf[9])) {
    return false;
  }

  const baseDv2 = paddedCpf.substring(0, 10);
  const expectedDv2 = _calculateVerifierDigit(baseDv2);

  // Compara o segundo dígito e retorna o resultado final da validação.
  return expectedDv2 === Number(paddedCpf[10]);
}

// ------------------------------------------------------------------------------------------------

// Exporta a função para uso em ambientes Node.js (CommonJS).
module.exports = validateCPF;

// ------------------------------------------------------------------------------------------------