import toString from "./toString.js";

// ------------------------------------------------------------------------------------------------

/**
 * @file Utilitário para substituir caracteres em uma string com base em um conjunto permitido.
 */

/**
 * @summary Substitui caracteres em uma string que não pertencem a um conjunto de caracteres permitido.
 *
 * @description
 * Esta função cria dinamicamente uma expressão regular a partir de uma string que define um
 * conjunto de caracteres permitidos. Ela então remove ou substitui todos os caracteres da
 * string de entrada que não fazem parte desse conjunto. É uma ferramenta flexível
 * para limpar e sanitizar strings.
 *
 * @param {*} [text=""] - O valor a ser processado, que será convertido para string.
 * @param {string} [regex="A-Za-zÀ-ú0-9 "] - Uma string que define o conjunto de caracteres
 * a serem **mantidos**. Pode incluir intervalos, como `A-Z` ou `0-9`.
 * @param {string} [replacement=""] - A string que substituirá cada caractere não permitido.
 * @param {boolean} [trim=true] - Se `true`, remove espaços em branco do início e do fim do resultado.
 *
 * @returns {string} A string resultante após a substituição e o trim opcional.
 *
 * @example
 * // Manter apenas letras e números, substituindo o resto por '*'
 * const text = "Hello! @123 World_456";
 * const allowed = "A-Za-z0-9";
 * const result = regexReplaceTrim(text, allowed, "*");
 * console.log(result); // "Hello***123*World*456"
 *
 * // Manter apenas letras maiúsculas e remover o resto
 * const textWithSpaces = "   A B C   ";
 * const resultTrimmed = regexReplaceTrim(textWithSpaces, "A-Z", "");
 * console.log(resultTrimmed); // "ABC"
 */
function regexReplaceTrim(
  text = "",
  regex = "A-Za-zÀ-ú0-9 ",
  replacement = "",
  trim = true
) {
  // 1. Converte as entradas para string para garantir a operação.
  const stringValue = toString(text);
  const allowedChars = toString(regex);
  const replacementValue = toString(replacement);

  // 2. Constrói a expressão regular que corresponde a qualquer caractere NÃO presente no conjunto.
  // A string `allowedChars` é inserida diretamente para permitir intervalos como 'A-Z'.
  const filterRegex = new RegExp(`[^${allowedChars}]`, "g");

  // 3. Realiza a substituição uma única vez para evitar duplicação de código.
  let result = stringValue.replace(filterRegex, replacementValue);

  // 4. Aplica o trim opcionalmente ao resultado.
  if (trim) {
    result = result.trim();
  }

  return result;
}

// ------------------------------------------------------------------------------------------------

export default regexReplaceTrim;