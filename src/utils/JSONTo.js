/**
 * @file Utilitário seguro para converter valores JavaScript em strings JSON.
 */

/**
 * @summary Converte um valor JavaScript para uma string JSON de forma segura.
 *
 * @description
 * Esta função é um wrapper para `JSON.stringify()` que simplifica o tratamento de erros.
 * `JSON.stringify` pode lançar uma exceção ao tentar serializar estruturas com
 * referências circulares ou valores `BigInt`. Esta função permite capturar esses erros
 * e retornar `null` em vez de quebrar a execução do programa.
 *
 * @param {any} object - O valor JavaScript (objeto, array, primitivo, etc.) a ser convertido.
 * @param {boolean} [throwsError=true] - Se `true`, a função lançará uma exceção em caso de
 * erro na serialização. Se `false`, retornará `null`.
 *
 * @returns {string | null} A string JSON resultante, ou `null` se a serialização falhar e
 * `throwsError` for `false`.
 *
 * @throws {TypeError} Lança um `TypeError` se o valor contiver referências circulares
 * ou um `BigInt` (e `throwsError` for `true`).
 *
 * @example
 * const user = { id: 1, name: 'Arthur' };
 * const jsonString = JSONTo(user);
 * console.log(jsonString); // '{"id":1,"name":"Arthur"}'
 *
 * // Exemplo com referência circular, que normalmente quebraria a aplicação
 * const obj = { name: 'obj' };
 * obj.self = obj;
 *
 * // Comportamento seguro (retorna null)
 * const resultado = JSONTo(obj, false);
 * console.log(resultado); // null
 *
 * // Comportamento padrão (lança erro)
 * try {
 * JSONTo(obj, true);
 * } catch (e) {
 * console.error(e.message); // Ex: "Converting circular structure to JSON..."
 * }
 */
function JSONTo(object = {}, throwsError = true) {
  try {
    // 1. Tenta converter o valor para uma string JSON.
    return JSON.stringify(object);
  } catch (error) {
    // 2. Lida com erros de serialização (ex: referências circulares).
    if (throwsError) {
      // Re-lança o erro original, mantendo o comportamento padrão do JavaScript.
      throw error;
    }

    // Se os erros não devem ser lançados, retorna null.
    return null;
  }
}

// ------------------------------------------------------------------------------------------------

export default JSONTo;