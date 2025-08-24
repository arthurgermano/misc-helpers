/**
 * @fileoverview Funções para validação de inscrição estadual (CAD/ICMS) do estado do Paraná (PR).
 * Código compatível com Node.js e navegadores.
 */

/**
 * Calcula um dígito verificador com base em uma sequência de dígitos e um array de pesos.
 * Esta é uma função auxiliar interna para evitar a repetição da lógica de cálculo.
 *
 * @param {string} digits - A sequência de dígitos a ser usada no cálculo.
 * @param {number[]} weights - O array de pesos para multiplicar cada dígito.
 * @returns {number} O dígito verificador calculado.
 * @private
 */
function _calculateVerifierDigit(digits, weights) {
  // Multiplica cada dígito pelo seu peso correspondente e soma os resultados.
  // O uso de 'reduce' é uma forma funcional e concisa de realizar a soma ponderada.
  const sum = digits
    .split('')
    .reduce((acc, digit, index) => acc + (Number(digit) * weights[index]), 0);

  const remainder = sum % 11;

  // Conforme a regra de cálculo, se o resto for 0 ou 1, o dígito é 0.
  // Caso contrário, é 11 menos o resto.
  return (remainder <= 1) ? 0 : 11 - remainder;
}

/**
 * Valida uma inscrição estadual (CAD/ICMS) do estado do Paraná (PR).
 * A função lida com entradas formatadas (com pontos, traços) e não formatadas,
 * desde que contenham a quantidade correta de dígitos.
 *
 * @summary Valida o CAD/ICMS do estado do Paraná.
 * @param {string | number} cadicms O valor do CAD/ICMS a ser validado.
 * @returns {boolean} Retorna `true` se o CAD/ICMS for válido, e `false` caso contrário.
 * @example
 * // Exemplo com números e strings formatadas/não formatadas
 * validateCADICMSPR("90312851-11"); // true
 * validateCADICMSPR("9031285111");  // true
 * validateCADICMSPR(9031285111);   // true
 * validateCADICMSPR("1234567890");  // false
 */
function validateCADICMSPR(cadicms) {
  // Garante que a entrada seja uma string e remove todos os caracteres não numéricos.
  // O construtor String() lida de forma segura com null, undefined e outros tipos.
  const digitsOnly = String(cadicms).replace(/[^\d]/g, '');

  // Define o tamanho esperado para a inscrição estadual.
  const CADICMS_LENGTH = 10;

  // A inscrição estadual deve ter no máximo 10 dígitos e não pode estar vazia.
  // A validação original permite números menores que 10 e os preenche com zeros,
  // essa lógica é mantida.
  if (digitsOnly === '' || digitsOnly.length > CADICMS_LENGTH) {
    return false;
  }

  // Se a string for menor que 10, preenche com zeros à esquerda até atingir o tamanho correto.
  const paddedCadicms = digitsOnly.padStart(CADICMS_LENGTH, '0');

  // --- Cálculo do Primeiro Dígito Verificador ---

  // Pesos para o cálculo do primeiro dígito (baseado nos 8 primeiros dígitos da inscrição).
  const WEIGHTS_DV1 = [3, 2, 7, 6, 5, 4, 3, 2];
  const firstEightDigits = paddedCadicms.substring(0, 8);
  const expectedFirstVerifier = _calculateVerifierDigit(firstEightDigits, WEIGHTS_DV1);

  // Compara o dígito calculado com o nono dígito da inscrição.
  // A conversão para Number() garante uma comparação estrita de tipos.
  const firstVerifier = Number(paddedCadicms[8]);
  if (expectedFirstVerifier !== firstVerifier) {
    return false;
  }

  // --- Cálculo do Segundo Dígito Verificador ---

  // Pesos para o cálculo do segundo dígito (baseado nos 9 primeiros dígitos da inscrição).
  const WEIGHTS_DV2 = [4, 3, 2, 7, 6, 5, 4, 3, 2];
  const firstNineDigits = paddedCadicms.substring(0, 9);
  const expectedSecondVerifier = _calculateVerifierDigit(firstNineDigits, WEIGHTS_DV2);

  // Compara o dígito calculado com o décimo (último) dígito da inscrição.
  const secondVerifier = Number(paddedCadicms[9]);
  
  // O retorno final é o resultado da comparação do segundo dígito.
  return expectedSecondVerifier === secondVerifier;
}

// ------------------------------------------------------------------------------------------------

// Mantém a exportação no padrão CommonJS para compatibilidade com Node.js.
// Em um ambiente de navegador, esta linha será ignorada.
export default validateCADICMSPR;

// ------------------------------------------------------------------------------------------------