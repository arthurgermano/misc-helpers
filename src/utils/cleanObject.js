/**
 * @fileoverview Fornece uma função para "limpar" um objeto, removendo chaves
 * com valores considerados vazios, nulos ou indesejados.
 */

/**
 * @summary Cria uma cópia "limpa" de um objeto, removendo chaves com valores vazios de forma segura e performática.
 *
 * @description
 * Itera sobre as chaves de um objeto (incluindo `Symbol`s) e retorna uma nova cópia contendo apenas as
 * chaves com valores considerados "válidos". Por padrão, `undefined`, `null`, strings vazias, arrays
 * vazios e objetos que se tornam vazios após a limpeza são removidos.
 * Tipos complexos como `Date` e `RegExp` são preservados como valores válidos.
 *
 * A função é segura contra referências circulares; estruturas cíclicas são interrompidas
 * e as propriedades que causam o ciclo são removidas do resultado final.
 *
 * @param {any} sourceObject - O objeto a ser limpo. Se não for um objeto "simples" (plain object), será retornado diretamente.
 * @param {object} [options={}] - Opções para customizar o comportamento da limpeza.
 * @property {boolean} [options.recursive=true] - Se `true`, a função será aplicada recursivamente a
 * objetos aninhados. Se `false`, objetos aninhados são mantidos como estão.
 * @property {boolean} [options.considerNullValue=false] - Se `false` (padrão), chaves com valor `null`
 * são removidas. Se `true`, são mantidas.
 * @property {boolean} [options.considerFalseValue=true] - Se `true` (padrão), chaves com valor `false`
 * são mantidas. Se `false`, são removidas.
 *
 * @returns {object|any} Um novo objeto "limpo" ou o valor original se a entrada não for um objeto.
 *
 * @example
 * // Exemplo com Symbol e RegExp
 * const sym = Symbol('id');
 * const complexObj = {
 * [sym]: 'valor-do-symbol',
 * regex: /abc/g,
 * a: 1,
 * b: null
 * };
 * const cleanedComplex = cleanObject(complexObj);
 * // Retorna: { [sym]: 'valor-do-symbol', regex: /abc/g, a: 1 }
 * console.log(cleanedComplex);
 */
function cleanObject(sourceObject, options = {}) {
  // O WeakMap rastreia os objetos já visitados para evitar ciclos infinitos.
  const cache = new WeakMap();

  // Função interna recursiva que faz o trabalho principal.
  function _clean(currentObject) {
    // Valores que não são "plain objects" (como Date, RegExp, arrays, primitivos)
    // são tratados como valores finais e não devem ser iterados.
    if (
      currentObject === null ||
      typeof currentObject !== 'object' ||
      currentObject.constructor !== Object
    ) {
      return currentObject;
    }
    
    // Se o objeto já foi visitado nesta chamada, é uma referência circular.
    // Retorna 'undefined' para que a chave que aponta para ele seja removida.
    if (cache.has(currentObject)) {
      return undefined;
    }

    const {
      recursive = true,
      considerNullValue = false,
      considerFalseValue = true,
    } = options || {};

    const newObj = {};
    // Adiciona o objeto ao cache antes de iterar para detectar ciclos que apontem para ele mesmo.
    cache.set(currentObject, newObj);

    // Usa-se Reflect.ownKeys para garantir que chaves do tipo Symbol sejam incluídas,
    // ao contrário de Object.keys ou for...in.
    for (const key of Reflect.ownKeys(currentObject)) {
      let value = currentObject[key];

      if (recursive) {
        value = _clean(value);
      }

      const isUndefined = value === undefined;
      const isNullAndIgnored = value === null && !considerNullValue;
      const isFalseAndIgnored = value === false && !considerFalseValue;
      const isEmptyString = value === '';
      const isEmptyArray = Array.isArray(value) && value.length === 0;
      
      // Um objeto que se tornou vazio após a limpeza recursiva também deve ser removido.
      const isEmptyObjectAfterCleaning = 
        value !== null &&
        typeof value === 'object' &&
        value.constructor === Object &&
        Reflect.ownKeys(value).length === 0;

      if (
        !isUndefined &&
        !isNullAndIgnored &&
        !isFalseAndIgnored &&
        !isEmptyString &&
        !isEmptyArray &&
        !isEmptyObjectAfterCleaning
      ) {
        newObj[key] = value;
      }
    }
    
    // Se o objeto resultante não tiver chaves, ele é considerado vazio.
    // Retorna `undefined` para que a chave que aponta para ele seja removida no nível pai.
    return Reflect.ownKeys(newObj).length > 0 ? newObj : undefined;
  }

  const result = _clean(sourceObject);

  // CORREÇÃO: Se o resultado final da limpeza do objeto de nível superior for `undefined`
  // (ou seja, ele ficou vazio), retorna `{}`, conforme esperado pelos testes.
  if (result === undefined && sourceObject?.constructor === Object) {
    return {};
  }

  return result;
}

// ------------------------------------------------------------------------------------------------
export default cleanObject;
// ------------------------------------------------------------------------------------------------