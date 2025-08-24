import toString from "./toString.js";

// ------------------------------------------------------------------------------------------------

/**
 * @file Utilitário para extrair apenas letras de um valor.
 */

/**
 * @summary Extrai apenas caracteres alfabéticos (letras) de uma string ou de outro valor.
 *
 * @description
 * Esta função recebe um valor de qualquer tipo, o converte para uma string e remove
 * todos os caracteres que não são letras, como números, símbolos, espaços e
 * pontuação. Ela preserva tanto letras do alfabeto padrão (a-z, A-Z) quanto
 * a maioria das letras acentuadas comuns (à, ç, õ, etc.).
 *
 * @param {*} [text=""] - O valor do qual as letras serão extraídas.
 *
 * @returns {string} Uma string contendo apenas as letras do valor de entrada.
 *
 * @example
 * const fullName = 'José "Zé" da Silva - 1985';
 * const letters = regexLettersOnly(fullName);
 * console.log(letters); // "JoséZédaSilva"
 *
 * const product = 'Camiseta (Polo) - Azul';
 * const productName = regexLettersOnly(product);
 * console.log(productName); // "CamisetaPoloAzul"
 */
function regexLettersOnly(text = "") {
  // 1. Converte a entrada para uma string de forma segura.
  const stringValue = toString(text);

  // 2. Remove todos os caracteres que não são letras.
  // A regex `/[^A-Za-zÀ-ú]/g` encontra qualquer caractere que não esteja nos
  // intervalos de 'A' a 'Z', 'a' a 'z', ou no intervalo de caracteres acentuados comuns.
  return stringValue.replace(/[^A-Za-zÀ-ú]/g, "");
}

// ------------------------------------------------------------------------------------------------

export default regexLettersOnly;