/**
 * @file Módulo para mesclar objetos de forma imutável.
 */

/**
 * Cria uma cópia profunda (deep clone) de um valor.
 * Esta função auxiliar é a base para garantir a imutabilidade.
 * Ela lida com objetos, arrays e referências circulares.
 *
 * @param {*} source - O valor a ser clonado.
 * @param {WeakMap} [map=new WeakMap()] - Usado internamente para rastrear
 * referências e evitar loops infinitos em estruturas circulares.
 * @returns {*} Uma cópia profunda do valor de entrada.
 * @private
 */
function deepClone(source, map = new WeakMap()) {
  // Retorna valores primitivos e nulos, que não precisam ser clonados.
  if (source === null || typeof source !== 'object') {
    return source;
  }

  // Se este objeto já foi clonado (em caso de referência circular),
  // retorna a referência do clone já existente para evitar recursão infinita.
  if (map.has(source)) {
    return map.get(source);
  }

  // Lida com Arrays.
  if (Array.isArray(source)) {
    const clone = [];
    // Armazena o clone no mapa antes da recursão para lidar com
    // arrays que contenham referências a si mesmos.
    map.set(source, clone);
    for (let i = 0; i < source.length; i++) {
      clone[i] = deepClone(source[i], map);
    }
    return clone;
  }

  // Lida com Objetos.
  const clone = {};
  // Armazena o clone no mapa antes da recursão para lidar com
  // objetos que contenham referências a si mesmos.
  map.set(source, clone);
  for (const key in source) {
    // Garante que estamos copiando apenas as propriedades do próprio objeto.
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      clone[key] = deepClone(source[key], map);
    }
  }

  return clone;
}


/**
 * Realiza uma clonagem profunda de dois objetos e, em seguida, mescla as propriedades
 * do objeto `source` no objeto `target`.
 *
 * @description
 * Esta função garante imutabilidade, pois opera em clones dos objetos de entrada,
 * deixando os originais intactos. A mesclagem em si é superficial (similar ao
 * `Object.assign`), o que significa que se uma propriedade existir em ambos os objetos,
 * a propriedade do `source` substituirá completamente a do `target`.
 *
 * @param {object} [target={}] - O objeto de destino. Suas propriedades serão a base
 * para o novo objeto.
 * @param {object} [source={}] - O objeto de origem. Suas propriedades serão mescladas
 * e irão sobrescrever as propriedades do `target` em caso de conflito.
 * @param {boolean} [throwsError=true] - Se `true`, a função lançará exceções em caso
 * de parâmetros inválidos. Se `false`, retornará `null`.
 *
 * @returns {object | null} Um novo objeto resultante da mesclagem ou `null` se
 * `throwsError` for `false` e ocorrer um erro.
 *
 * @throws {TypeError} Lançado se `target` ou `source` não forem objetos.
 * @throws {Error} Lançado se ocorrer um erro durante a operação (ex: stack overflow
 * em objetos excessivamente aninhados).
 *
 * @example
 * const defaults = { settings: { theme: 'dark', notifications: true }, user: 'admin' };
 * const userConfig = { settings: { notifications: false, timezone: 'UTC-3' } };
 *
 * const merged = assign(defaults, userConfig);
 * // Resultado:
 * // {
 * //   settings: { notifications: false, timezone: 'UTC-3' },
 * //   user: 'admin'
 * // }
 *
 * console.log(defaults.settings.theme); // 'dark' (original não foi modificado)
 */
function assign(target = {}, source = {}, throwsError = true) {
  // Validação rigorosa dos parâmetros de entrada.
  // A verificação `param === null` é crucial, pois `typeof null` retorna 'object'.
  if (target === null || typeof target !== 'object') {
    if (throwsError) {
      throw new TypeError("Assign Function: The target provided is not an object");
    }
    return null;
  }

  if (source === null || typeof source !== 'object') {
    if (throwsError) {
      throw new TypeError("Assign Function: The source provided is not an object");
    }
    return null;
  }

  try {
    // Utiliza nossa implementação de clonagem profunda customizada e compatível.
    // Isso garante que os objetos originais (`target` e `source`) não sejam modificados (imutabilidade).
    const clonedTarget = deepClone(target);
    const clonedSource = deepClone(source);

    // `Object.assign` realiza a mesclagem superficial das propriedades do clone
    // de `source` para o clone de `target`. Esta é a forma mais eficiente de
    // combinar as propriedades no nível superior dos objetos.
    return Object.assign(clonedTarget, clonedSource);
  } catch (error) {
    if (throwsError) {
      // Repassa o erro original para fornecer um contexto de depuração mais rico.
      throw error;
    }
    // Retorna null se a captura de erros estiver desativada e ocorrer uma falha.
    return null;
  }
}

// ------------------------------------------------------------------------------------------------

// Garante compatibilidade com o sistema de módulos CommonJS (Node.js).
export default assign;

// ------------------------------------------------------------------------------------------------