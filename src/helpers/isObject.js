/**
 * @fileoverview Fornece uma função para verificar se um valor é um objeto.
 */

/**
 * Verifica se um valor fornecido é um objeto, excluindo `null`.
 *
 * @summary Verifica se um valor é um objeto (mas não nulo).
 * @description Esta função retorna `true` para qualquer valor que o JavaScript considera
 * um objeto (`typeof valor === 'object'`), com a exceção explícita de `null`.
 * Note que, devido à natureza do JavaScript, isso inclui arrays e instâncias de outras
 * classes (como `Date`), mas não inclui tipos primitivos.
 *
 * @param {*} object - O valor a ser verificado.
 * @returns {boolean} Retorna `true` se o valor for um objeto e não for `null`; caso contrário, `false`.
 * @example
 * // Casos verdadeiros
 * isObject({});               // true
 * isObject({ a: 1 });       // true
 * isObject([]);               // true (arrays são objetos)
 * isObject(new Date());       // true (instâncias de classe são objetos)
 *
 * // Casos falsos
 * isObject(null);             // false (a principal exceção)
 * isObject(undefined);        // false
 * isObject("texto");          // false (primitivo)
 * isObject(123);              // false (primitivo)
 * isObject(() => {});         // false (funções têm typeof 'function')
 */
function isObject(object) {
  // A verificação `object !== null` é crucial porque `typeof null` retorna 'object'.
  // Esta linha combina as duas verificações da função original de forma mais concisa.
  return object !== null && typeof object === "object";
}

// ------------------------------------------------------------------------------------------------
export default isObject;
// ------------------------------------------------------------------------------------------------
