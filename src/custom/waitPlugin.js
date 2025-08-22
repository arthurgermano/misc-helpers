/**
 * @fileoverview Fornece uma classe para gerenciar estados de espera assíncronos (Promises).
 * @description Este módulo exporta uma instância única (singleton) da WaitPlugin.
 */

/**
 * @class WaitPlugin
 * @summary Gerencia a criação e resolução de Promises "on-demand".
 * @description Utiliza um Map internamente para máxima performance em adições e remoções,
 * enquanto expõe a lista de esperas como um Objeto para compatibilidade e depuração.
 */
class WaitPlugin {
  
  /**
   * Inicializa o plugin.
   * @constructor
   */
  constructor() {
    /**
     * Armazena as esperas ativas. É um Map privado para performance.
     * @private
     * @type {Map<string, {promise: Promise<any>, resolve: Function, reject: Function}>}
     */
    this._waitList = new Map();
  }

  /**
   * Getter público para a lista de esperas.
   * @description Converte o Map interno em um Objeto simples para fins de compatibilidade
   * com testes ou para facilitar a depuração.
   * @returns {Object<string, {promise: Promise<any>, resolve: Function, reject: Function}>}
   */
  get waitList() {
    return Object.fromEntries(this._waitList);
  }

  // ----------------------------------------------------------------------------------------------

  /**
   * Finaliza uma espera, resolvendo ou rejeitando a Promise correspondente.
   *
   * @param {string} name - O nome único da espera a ser finalizada.
   * @param {boolean} [isSuccessful=true] - Se `true`, a Promise será resolvida. Se `false`, será rejeitada.
   * @param {*} [returnParam] - O valor a ser passado para o `resolve` ou `reject` da Promise.
   * @returns {any} Retorna `false` se a espera não existir. Em caso de erro interno, retorna o
   * próprio objeto de erro. Em sucesso, o retorno é indefinido.
   */
  finishWait(name, isSuccessful = true, returnParam) {
    try {
      const waitItem = this._waitList.get(name);
      if (!waitItem) {
        return false;
      }

      if (isSuccessful) {
        waitItem.resolve(returnParam);
      } else {
        waitItem.reject(returnParam);
      }
    } catch (error) {
      return error;
    } finally {
      // A operação delete do Map é segura e performática.
      this._waitList.delete(name);
    }
  }

  // ----------------------------------------------------------------------------------------------

  /**
   * Inicia uma nova espera e retorna uma Promise associada a ela.
   *
   * @param {string} name - O nome único para a nova espera.
   * @returns {Promise<any>|undefined} Retorna a Promise que aguardará a finalização.
   * Retorna `undefined` se uma espera com o mesmo nome já existir.
   */
  startWait(name) {
    if (this._waitList.has(name)) {
      return;
    }
    
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    
    this._waitList.set(name, { promise, resolve, reject });
    
    return promise;
  }

  // ----------------------------------------------------------------------------------------------

  /**
   * Finaliza todas as esperas ativas de uma só vez.
   *
   * @param {boolean} isSuccessful - Se `true`, todas as Promises serão resolvidas. Se `false`, serão rejeitadas.
   * @param {*} [returnParam] - O valor a ser passado para cada `resolve` ou `reject`.
   */
  finishAll(isSuccessful, returnParam) {
    // Cria uma cópia das chaves antes de iterar. É a forma mais segura de
    // modificar uma coleção (neste caso, o Map) enquanto ela está sendo percorrida.
    const allWaitKeys = Array.from(this._waitList.keys());
    
    for (const key of allWaitKeys) {
      this.finishWait(key, isSuccessful, returnParam);
    }
  }

  // ----------------------------------------------------------------------------------------------
}

// ------------------------------------------------------------------------------------------------

/**
 * Instância única (singleton) do WaitPlugin.
 * @type {WaitPlugin}
 */
const WP = new WaitPlugin();

// ------------------------------------------------------------------------------------------------

module.exports = WP;