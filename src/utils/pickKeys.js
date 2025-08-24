/**
 * @fileoverview Fornece uma função para criar um novo objeto contendo apenas um
 * subconjunto de chaves de um objeto de origem.
 */

/**
 * @summary Cria um novo objeto contendo apenas as chaves especificadas de um objeto de origem.
 * @description Itera sobre um array de chaves (`keysToPick`) e constrói um novo objeto
 * com as chaves e valores correspondentes do objeto de origem (`sourceObject`).
 * Chaves que existem em `keysToPick` mas não no `sourceObject` são ignoradas.
 * A função não modifica o objeto original.
 *
 * @param {object} sourceObject - O objeto do qual as propriedades serão selecionadas.
 * @param {string[]} keysToPick - Um array de nomes de chaves (strings) a serem incluídas no novo objeto.
 * @returns {object} Um novo objeto contendo apenas as propriedades selecionadas.
 *
 * @example
 * const user = {
 * id: 123,
 * name: 'John Doe',
 * email: 'john.doe@example.com',
 * isAdmin: true,
 * lastLogin: new Date()
 * };
 *
 * const keys = ['id', 'name', 'email'];
 * const publicUserData = pickKeys(user, keys);
 *
 * // Retorna: { id: 123, name: 'John Doe', email: 'john.doe@example.com' }
 * console.log(publicUserData);
 *
 * @example
 * // Chaves não existentes são simplesmente ignoradas
 * const partialData = pickKeys(user, ['id', 'nonExistentKey']);
 * // Retorna: { id: 123 }
 * console.log(partialData);
 */
function pickKeys(sourceObject, keysToPick) {
  // Validação de entradas para garantir robustez. Retorna um objeto vazio para entradas inválidas.
  if (
    sourceObject === null ||
    typeof sourceObject !== "object" ||
    Array.isArray(sourceObject)
  ) {
    return {};
  }
  if (!Array.isArray(keysToPick)) {
    return {};
  }

  // Usa reduce para construir o novo objeto de forma eficiente e funcional.
  return keysToPick.reduce((newObj, key) => {
    // Verifica se a chave existe como uma propriedade própria do objeto de origem.
    // Usar Object.prototype.hasOwnProperty.call é a forma mais segura de fazer essa checagem.
    if (Object.prototype.hasOwnProperty.call(sourceObject, key)) {
      newObj[key] = sourceObject[key];
    }
    return newObj;
  }, {});
}

// ------------------------------------------------------------------------------------------------
export default pickKeys;
// ------------------------------------------------------------------------------------------------
