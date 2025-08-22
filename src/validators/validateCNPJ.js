/**
 * @fileoverview Fornece uma função para validar números de CNPJ (Cadastro Nacional da Pessoa Jurídica).
 * O código é compatível com ambientes Node.js e navegadores.
 */

/**
 * Array de pesos utilizado no algoritmo de cálculo dos dígitos verificadores do CNPJ.
 * @private
 * @type {number[]}
 */
const DEFAULT_WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

/**
 * Calcula o valor numérico de um caractere para o algoritmo de soma ponderada.
 * A conversão é baseada no valor ASCII do caractere, o que resulta em um
 * mapeamento específico para letras (ex: 'A' => 17, 'B' => 18).
 *
 * @private
 * @param {string} char - O caractere a ser convertido.
 * @returns {number} O valor numérico correspondente para o cálculo.
 */
function _getCharValue(char) {
  // A subtração do charCode de '0' é o método que define a conversão.
  return char.charCodeAt(0) - '0'.charCodeAt(0);
}

/**
 * Calcula os dois dígitos verificadores para uma base de 12 caracteres de um CNPJ.
 *
 * @private
 * @param {string} baseCnpj - Os 12 primeiros caracteres do CNPJ.
 * @param {number[]} weights - O array de pesos a ser usado no cálculo.
 * @returns {string} Uma string contendo os dois dígitos verificadores calculados.
 */
function _calculateVerifierDigits(baseCnpj, weights) {
  /**
   * Calcula um único dígito verificador a partir do resultado de uma soma ponderada.
   * @param {number} sum - A soma ponderada.
   * @returns {number} O dígito verificador (0 a 9).
   */
  const getDigit = (sum) => {
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  let sum1 = 0;
  let sum2 = 0;

  for (let i = 0; i < baseCnpj.length; i++) {
    // Converte o caractere para seu valor numérico específico do algoritmo.
    const value = _getCharValue(baseCnpj[i]);
    sum1 += value * weights[i + 1];
    sum2 += value * weights[i];
  }

  const dv1 = getDigit(sum1);
  sum2 += dv1 * weights[baseCnpj.length]; // Adiciona o primeiro dígito ao cálculo do segundo.
  const dv2 = getDigit(sum2);

  return `${dv1}${dv2}`;
}

/**
 * Valida um número de CNPJ (Cadastro Nacional da Pessoa Jurídica).
 *
 * @summary Valida um CNPJ, com suporte a formatos alfanuméricos.
 * @description A função suporta o formato numérico padrão e o futuro formato alfanumérico.
 * A entrada pode conter ou não os caracteres de máscara comuns ('.', '/', '-').
 *
 * @param {string | number} cnpj O CNPJ a ser validado.
 * @param {object} [options={}] Opções de configuração para a validação.
 * @param {string} [options.addPaddingChar="0"] Caractere a ser usado para preencher a entrada até 14 caracteres.
 * @param {number[]} [options.weights=DEFAULT_WEIGHTS] Array de pesos para o cálculo dos dígitos verificadores.
 * @param {boolean} [options.ignoreToUpperCase=true] Se `false`, a entrada é convertida para maiúsculas. Se `true`, a validação diferencia maiúsculas de minúsculas.
 * @param {boolean} [options.ignorePadding=false] Se `true`, a função não adiciona preenchimento, validando a entrada como está.
 * @returns {boolean} Retorna `true` se o CNPJ for válido, e `false` caso contrário.
 */
function validateCNPJ(cnpj = "", options = {}) {
  // 1. Normalização e Configuração
  let processedCnpj = String(cnpj).replace(/[./-]/g, "");

  const finalOptions = {
    addPaddingChar: "0",
    weights: DEFAULT_WEIGHTS,
    ignorePadding: false,
    ignoreToUpperCase: true,
    ...options,
  };

  // A conversão para maiúsculas é um comportamento opcional controlado via `options`.
  if (finalOptions.ignoreToUpperCase === false) {
    processedCnpj = processedCnpj.toUpperCase();
  }

  if (!finalOptions.ignorePadding) {
    processedCnpj = processedCnpj.padStart(14, finalOptions.addPaddingChar);
  }

  // 2. Regras de Validação de Formato e Casos Inválidos

  // O CNPJ deve consistir em 12 caracteres alfanuméricos (base) e 2 dígitos (verificadores).
  const regexCNPJ = /^([A-Z\d]){12}(\d){2}$/;
  if (!regexCNPJ.test(processedCnpj)) {
    return false;
  }
  
  // Para CNPJs puramente numéricos, sequências de dígitos repetidos são inválidas (ex: '111...').
  if (/^\d+$/.test(processedCnpj) && /^(\d)\1{13}$/.test(processedCnpj)) {
    return false;
  }

  // 3. Cálculo e Verificação Final
  const baseDigits = processedCnpj.substring(0, 12);
  const verifierDigits = processedCnpj.substring(12);

  const calculatedVerifierDigits = _calculateVerifierDigits(baseDigits, finalOptions.weights);

  return verifierDigits === calculatedVerifierDigits;
}

// ------------------------------------------------------------------------------------------------

// Exporta a função para uso em ambientes Node.js (CommonJS).
module.exports = validateCNPJ;

// ------------------------------------------------------------------------------------------------