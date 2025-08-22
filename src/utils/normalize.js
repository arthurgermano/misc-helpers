const isNumber = require("../helpers/isNumber");

// ------------------------------------------------------------------------------------------------

/**
 * @file Utilitário para normalizar strings, removendo acentos.
 * @author Seu Nome <seu.email@example.com>
 * @version 2.0.0
 */

/**
 * @summary Remove acentos e outros caracteres diacríticos de uma string.
 *
 * @description
 * Esta função converte uma string para sua forma normalizada (NFD - Normalization Form
 * Canonical Decomposition), que separa os caracteres base de seus acentos (marcas
 * diacríticas combinadas). Em seguida, uma expressão regular remove essas marcas,
 * resultando em uma string "limpa", sem acentuação.
 *
 * A função processa apenas entradas do tipo `string` ou `number`, retornando
 * outros tipos de dados inalterados.
 *
 * @param {string | number} [text=""] - O texto a ser normalizado.
 *
 * @returns {*} A string normalizada, ou o valor original se a entrada não for
 * uma string ou número.
 *
 * @example
 * const acentuado = 'Pão de Açúcar & Linguiça';
 * const normalizado = normalize(acentuado);
 * console.log(normalizado); // "Pao de Acucar & Linguica"
 *
 * normalize(123.45); // Retorna a string "123.45"
 * normalize({ a: 1 }); // Retorna o objeto { a: 1 } inalterado
 */
function normalize(text = "") {
  // 1. Verifica se a entrada é um tipo que pode ser normalizado (string ou número).
  if (isNumber(text) || typeof text === "string") {
    // 2. Converte para string (caso seja número) e aplica a normalização.
    // "NFD" decompõe um caractere como "ç" em seus componentes: "c" + "¸".
    // A regex /[\u0300-\u036f]/g então remove o componente de acentuação (o intervalo
    // Unicode para "Combining Diacritical Marks").
    return String(text)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  // 3. Se a entrada não for do tipo esperado, retorna-a inalterada.
  return text;
}

// ------------------------------------------------------------------------------------------------

module.exports = normalize;