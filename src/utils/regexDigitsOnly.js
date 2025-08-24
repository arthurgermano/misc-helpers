import toString from "./toString.js";

// ------------------------------------------------------------------------------------------------

/**
 * @file Utilitário para extrair apenas dígitos de um valor.
 */

/**
 * @summary Extrai apenas os dígitos de uma string ou de outro valor.
 *
 * @description
 * Esta função recebe um valor de qualquer tipo, o converte para uma string e remove
 * todos os caracteres que não são dígitos (0-9). É útil para limpar entradas de
 * usuário, como números de telefone, CEPs ou CPFs que podem conter máscaras
 * (pontos, traços, parênteses).
 *
 * @param {*} [text=""] - O valor do qual os dígitos serão extraídos.
 *
 * @returns {string} Uma string contendo apenas os dígitos do valor de entrada.
 *
 * @example
 * const phoneNumber = '(11) 98765-4321';
 * const digits = regexDigitsOnly(phoneNumber);
 * console.log(digits); // "11987654321"
 *
 * const price = 'R$ 19,90';
 * const priceDigits = regexDigitsOnly(price);
 * console.log(priceDigits); // "1990"
 *
 * regexDigitsOnly(123.45); // Retorna "12345"
 */
function regexDigitsOnly(text = "") {
  // 1. Converte a entrada para uma string de forma segura.
  const stringValue = toString(text);

  // 2. Remove todos os caracteres que não são dígitos (0-9).
  // A regex `/[^0-9]/g` encontra qualquer caractere que não esteja no intervalo de 0 a 9
  // e o substitui por uma string vazia.
  return stringValue.replace(/[^0-9]/g, "");
}

// ------------------------------------------------------------------------------------------------

export default regexDigitsOnly;