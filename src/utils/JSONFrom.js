/**
 * @file Utilitário seguro para analisar (parse) strings JSON.
 * @author Seu Nome <seu.email@example.com>
 * @version 2.0.0
 */

/**
 * @summary Analisa uma string JSON de forma segura, com controle sobre o lançamento de erros.
 *
 * @description
 * Esta função é um wrapper para `JSON.parse()` que simplifica o tratamento de erros.
 * Em vez de precisar envolver cada chamada em um bloco `try...catch`, você pode
 * controlar o comportamento em caso de falha através do parâmetro `throwsError`.
 *
 * @param {string} text - A string JSON a ser analisada.
 * @param {boolean} [throwsError=true] - Se `true`, a função lançará uma exceção em caso de
 * JSON inválido (comportamento padrão de `JSON.parse`). Se `false`, retornará `null`.
 *
 * @returns {any | null} O valor ou objeto JavaScript resultante da análise, ou `null` se
 * a análise falhar e `throwsError` for `false`. `JSON.parse` pode retornar qualquer
 * tipo de dado JSON válido (objetos, arrays, strings, números, etc.).
 *
 * @throws {SyntaxError | TypeError} Lança um `TypeError` se a entrada não for uma string,
 * ou um `SyntaxError` se a string for um JSON inválido (e `throwsError` for `true`).
 *
 * @example
 * const jsonValido = '{"id": 1, "name": "Arthur"}';
 * const jsonInvalido = '{"id": 1, name: "Arthur"}'; // `name` sem aspas
 *
 * // Comportamento seguro (retorna null em caso de erro)
 * const resultado = JSONFrom(jsonInvalido, false);
 * console.log(resultado); // null
 *
 * // Comportamento padrão (lança erro)
 * try {
 * JSONFrom(jsonInvalido, true);
 * } catch (e) {
 * console.error(e.message); // Unexpected token n in JSON at position 11...
 * }
 *
 * const objeto = JSONFrom(jsonValido);
 * console.log(objeto.name); // "Arthur"
 */
function JSONFrom(text, throwsError = true) {
  // 1. Validação do tipo de entrada. `JSON.parse` espera uma string.
  if (typeof text !== "string") {
    if (throwsError) {
      throw new TypeError("A entrada para JSONFrom deve ser uma string.");
    }
    return null;
  }

  try {
    // 2. Tenta analisar a string.
    return JSON.parse(text);
  } catch (error) {
    // 3. Lida com erros de análise com base na opção fornecida.
    if (throwsError) {
      // Re-lança o erro original de `JSON.parse`.
      throw error;
    }

    // Se os erros não devem ser lançados, retorna null.
    return null;
  }
}

// ------------------------------------------------------------------------------------------------

module.exports = JSONFrom;
