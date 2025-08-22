const isObject = require("../helpers/isObject.js");

// ------------------------------------------------------------------------------------------------

/**
 * @file Utilitário para remover chaves de um objeto de forma não-mutável.
 * @author Seu Nome <seu.email@example.com>
 * @version 2.0.0
 */

/**
 * @summary Cria um novo objeto omitindo um conjunto de chaves especificadas.
 *
 * @description
 * Esta função recebe um objeto e um array de chaves, e retorna um **novo** objeto
 * contendo todas as propriedades do objeto original, exceto aquelas especificadas
 * no array de chaves.
 *
 * A função é **não-mutável**, o que significa que o objeto original passado como
 * argumento não é modificado.
 *
 * @param {object} [object={}] - O objeto de origem.
 * @param {string[]} [keys=[]] - Um array com os nomes (string) das chaves a serem omitidas.
 *
 * @returns {object} Um novo objeto sem as chaves especificadas.
 *
 * @example
 * const user = {
 * id: 123,
 * name: 'Arthur',
 * email: 'arthur@example.com',
 * password: 'supersecret'
 * };
 *
 * const publicUser = deleteKeys(user, ['password', 'email']);
 *
 * console.log(publicUser); // { id: 123, name: 'Arthur' }
 * console.log(user);       // O objeto original permanece inalterado
 */
function deleteKeys(object = {}, keys = []) {
  // 1. Validação da entrada.
  if (!isObject(object)) {
    return object;
  }
  if (!Array.isArray(keys)) {
    // Retorna uma cópia rasa se o array de chaves for inválido, garantindo a não-mutação.
    return { ...object };
  }

  // 2. Cria uma cópia rasa do objeto para evitar a mutação do original.
  const newObject = { ...object };

  // 3. Itera sobre as chaves a serem removidas e as deleta da CÓPIA.
  for (const key of keys) {
    delete newObject[key];
  }

  // 4. Retorna o novo objeto modificado.
  return newObject;
}

// ------------------------------------------------------------------------------------------------

module.exports = deleteKeys;