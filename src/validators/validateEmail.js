/**
 * @fileoverview Fornece uma função para validar endereços de e-mail.
 * O código é compatível com ambientes Node.js e navegadores.
 */

/**
 * Expressão regular para validar a maioria dos formatos de e-mail padrão.
 * Definida como uma constante fora da função para evitar a recompilação a cada
 * chamada, o que melhora a performance.
 * @private
 * @type {RegExp}
 */
const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * Valida um endereço de e-mail com base em um formato padrão.
 *
 * @summary Valida um endereço de e-mail.
 * @description A função verifica se a string fornecida corresponde a um formato de e-mail
 * comum, cobrindo a maioria dos casos de uso padrão (ex: `usuario@dominio.com`).
 *
 * @param {string | any} email O valor a ser verificado. A função o converterá para string.
 * @returns {boolean} Retorna `true` se o e-mail tiver um formato válido, e `false` caso contrário.
 * @example
 * validateEmail("contato@exemplo.com"); // true
 * validateEmail("email-invalido");       // false
 */
function validateEmail(email = "") {
  // Converte a entrada para string para garantir que o método .test() funcione.
  const emailAsString = String(email);

  // Testa a string contra a expressão regular pré-compilada.
  return EMAIL_REGEX.test(emailAsString);
}

// ------------------------------------------------------------------------------------------------

// Exporta a função para uso em ambientes Node.js (CommonJS).
export default validateEmail;

// ------------------------------------------------------------------------------------------------
