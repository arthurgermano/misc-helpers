/**
 * @fileoverview Fornece uma função utilitária que encapsula o operador nativo "instanceof".
 */

/**
 * Verifica se um objeto é uma instância de um determinado tipo (construtor).
 *
 * @summary Verifica se um objeto pertence a uma determinada classe ou tipo.
 * @description Esta função é um encapsulamento direto do operador `instanceof` do JavaScript.
 * Ele verifica se a propriedade `prototype` de um construtor aparece em algum lugar
 * na cadeia de protótipos de um objeto.
 *
 * @param {*} object - O objeto a ser verificado.
 * @param {Function} instanceType - O construtor (classe) contra o qual o objeto será verificado.
 * @returns {boolean} Retorna `true` se o objeto for uma instância do tipo fornecido; caso contrário, `false`.
 * @throws {TypeError} Lança um erro se `instanceType` não for um objeto com um construtor
 * (ex: `null`, `undefined`), replicando o comportamento nativo do operador `instanceof`.
 *
 * @example
 * // Usando construtores nativos
 * isInstanceOf(new Date(), Date);     // Retorna true
 * isInstanceOf([], Array);           // Retorna true
 * isInstanceOf("texto", String);     // Retorna false (primitivas não são instâncias diretas)
 *
 * // Usando classes personalizadas
 * class Carro {}
 * const meuCarro = new Carro();
 * isInstanceOf(meuCarro, Carro);      // Retorna true
 */
function isInstanceOf(object, instanceType) {
  // A função é um encapsulamento direto do operador nativo 'instanceof'.
  // Esta é a forma mais performática e direta de realizar a verificação.
  return object instanceof instanceType;
}

// ------------------------------------------------------------------------------------------------
export default isInstanceOf;
// ------------------------------------------------------------------------------------------------
