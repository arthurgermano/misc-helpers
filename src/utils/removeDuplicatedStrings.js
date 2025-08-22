const toString = require("./toString.js");
const isObject = require("../helpers/isObject");

// ------------------------------------------------------------------------------------------------

/**
 * @file Utilitário para remover substrings duplicadas de uma string.
 * @author Seu Nome <seu.email@example.com>
 * @version 2.2.0
 */

/**
 * @summary Remove substrings duplicadas de um texto, com opção de ignorar maiúsculas/minúsculas.
 *
 * @description
 * Esta função divide uma string em um array de substrings, remove as duplicatas
 * e une as substrings de volta em uma única string.
 *
 * **Comportamento Importante:**
 * - No modo padrão (sensível a maiúsculas/minúsculas), a **primeira** ocorrência de uma substring é mantida.
 * - No modo insensível a maiúsculas/minúsculas, a **última** ocorrência de uma substring é mantida, preservando sua capitalização original.
 *
 * @param {*} text - O valor a ser processado, que será convertido para string.
 * @param {string} [splitString=" "] - O caractere ou string usado para dividir o texto.
 * @param {boolean} [caseInsensitive=false] - Se `true`, a comparação de duplicatas
 * ignorará a diferença entre maiúsculas e minúsculas.
 *
 * @returns {string} Uma nova string com as substrings duplicadas removidas. Retorna uma
 * string vazia se a entrada for um objeto.
 *
 * @example
 * const phrase = 'apple Orange apple ORANGE';
 *
 * // Sensível a maiúsculas/minúsculas (mantém a primeira ocorrência)
 * removeDuplicatedStrings(phrase); // "apple Orange ORANGE"
 *
 * // Insensível a maiúsculas/minúsculas (mantém a última ocorrência)
 * removeDuplicatedStrings(phrase, ' ', true); // "apple ORANGE"
 */
function removeDuplicatedStrings(
  text,
  splitString = " ",
  caseInsensitive = false
) {
  // 1. Validação da entrada.
  if (isObject(text)) {
    return "";
  }

  // 2. Prepara o array de substrings.
  const separator = toString(splitString);
  const array = toString(text)
    .trim()
    .split(separator)
    .filter(v => v);

  // 3. Lógica para remover duplicatas.
  if (!caseInsensitive) {
    // Mantém a PRIMEIRA ocorrência de cada item.
    return [...new Set(array)].join(separator);
  } else {
    // Lógica para manter a ÚLTIMA ocorrência, de forma performática.
    const seenIndexes = {};
    // 1. Mapeia a versão minúscula de cada item para o seu último índice no array.
    array.forEach((item, index) => {
      seenIndexes[item.toLowerCase()] = index;
    });

    // 2. Extrai apenas os índices que devem ser mantidos (os das últimas ocorrências).
    const indexesToKeep = new Set(Object.values(seenIndexes));

    // 3. Filtra o array original, mantendo apenas os itens nos índices desejados.
    // Isso preserva a ordem e a capitalização corretas.
    return array
      .filter((_item, index) => indexesToKeep.has(index))
      .join(separator);
  }
}

// ------------------------------------------------------------------------------------------------

module.exports = removeDuplicatedStrings;