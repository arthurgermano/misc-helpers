/**
 * @file Utilitário para gerar strings aleatórias seguras.
 */

// Define os conjuntos de caracteres como constantes para clareza e reutilização.
const CHAR_SETS = {
  LOWERCASE: 'abcdefghijklmnopqrstuvwxyz',
  UPPERCASE: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  ACCENTED: 'àáâãçèéêìíîðñòóôõùúûý',
  DIGITS: '0123456789',
  SYMBOLS: '!@#$%^&*-_+=;:,.<>?'
};

/**
 * @summary Gera uma string aleatória criptograficamente segura.
 *
 * @description
 * Esta função gera uma string aleatória com um tamanho especificado, usando um conjunto de
 * caracteres customizável. Ela utiliza a Web Crypto API (`crypto.getRandomValues`),
 * que está disponível em navegadores modernos e no Node.js, para garantir que os
 * caracteres sejam selecionados de forma segura e imprevisível, tornando-a adequada
 * para gerar senhas, tokens ou outros valores sensíveis.
 *
 * @param {number} [size=32] - O comprimento da string a ser gerada.
 * @param {object} [options={}] - Opções para customizar o conjunto de caracteres.
 * @param {boolean} [options.excludeLowerCaseChars=false] - Excluir caracteres minúsculos.
 * @param {boolean} [options.excludeUpperCaseChars=false] - Excluir caracteres maiúsculos.
 * @param {boolean} [options.excludeAccentedChars=false] - Excluir caracteres acentuados.
 * @param {boolean} [options.excludeDigits=false] - Excluir dígitos numéricos.
 * @param {boolean} [options.excludeSymbols=false] - Excluir símbolos padrão.
 * @param {string} [options.includeSymbols=""] - Uma string com símbolos adicionais
 * para incluir no conjunto de caracteres.
 *
 * @returns {string} A string aleatória gerada.
 */
function generateRandomString(size = 32, options = {}) {
  // 1. Define as opções padrão e as mescla com as fornecidas pelo usuário.
  // Isso garante que o envio de opções parciais (ex: { excludeDigits: true }) funcione corretamente.
  const defaultOptions = {
    excludeLowerCaseChars: false,
    excludeUpperCaseChars: false,
    excludeAccentedChars: false,
    excludeDigits: false,
    excludeSymbols: false,
    includeSymbols: ""
  };
  const finalOptions = { ...defaultOptions, ...options };

  // 2. Constrói a string de caracteres válidos com base nas opções.
  let validChars = finalOptions.includeSymbols;
  if (!finalOptions.excludeLowerCaseChars) validChars += CHAR_SETS.LOWERCASE;
  if (!finalOptions.excludeUpperCaseChars) validChars += CHAR_SETS.UPPERCASE;
  if (!finalOptions.excludeAccentedChars) validChars += CHAR_SETS.ACCENTED;
  if (!finalOptions.excludeDigits) validChars += CHAR_SETS.DIGITS;
  if (!finalOptions.excludeSymbols) validChars += CHAR_SETS.SYMBOLS;

  // Se não houver caracteres válidos ou o tamanho for zero, retorna uma string vazia.
  if (validChars.length === 0 || size <= 0) {
    return "";
  }

  // 3. Gera a string aleatória usando uma fonte criptograficamente segura.
  const randomValues = new Uint32Array(size);
  // `crypto.getRandomValues` preenche o array com números aleatórios seguros.
  // `globalThis` garante compatibilidade entre Node.js, navegadores e web workers.
  globalThis.crypto.getRandomValues(randomValues);

  let result = [];
  for (let i = 0; i < size; i++) {
    // Usa o operador de módulo para mapear o número aleatório a um índice válido.
    const randomIndex = randomValues[i] % validChars.length;
    result.push(validChars[randomIndex]);
  }

  return result.join('');
}

// ------------------------------------------------------------------------------------------------

export default generateRandomString;