import cloneDeep from "lodash.clonedeep";

  // ------------------------------------------------------------------------------------------------

  /**
   * @summary Realiza uma cópia profunda (deep clone) e uma fusão (merge) de dois objetos, retornando um novo objeto.
   * @description Esta função cria cópias profundas dos objetos 'target' e 'source' para garantir imutabilidade
   * e, em seguida, mescla as propriedades do 'source' no 'target'. As propriedades do 'source'
   * sobrescrevem as propriedades de mesmo nome no 'target'.
   *
   * @param {object} [target={}] - O objeto de destino. Servirá de base para a fusão.
   * @param {object} [source={}] - O objeto de origem. Suas propriedades serão mescladas no 'target'.
   * @param {object} [options={}] - Opções de configuração para a função.
   * @param {boolean} [options.throwsError=true] - Se `true`, a função lançará um erro em caso de parâmetros inválidos. Se `false`, retornará `null`.
   * @returns {object|null} Um novo objeto com o resultado da fusão, ou `null` se ocorrer um erro e `options.throwsError` for `false`.
   *
   * @example
   * const defaults = { user: { name: 'Anônimo', rights: ['read'] } };
   * const settings = { user: { name: 'Admin' }, theme: 'dark' };
   *
   * const finalConfig = assign(defaults, settings);
   * // finalConfig é: { user: { name: 'Admin', rights: ['read'] }, theme: 'dark' }
   * // Os objetos 'defaults' e 'settings' não são modificados.
   */
  function assign(target = {}, source = {}, options = {}) {
    const { throwsError = true } = options;

    // Validação aprimorada para garantir que os parâmetros são objetos válidos (e não nulos).
    if (target === null || typeof target !== "object") {
      if (throwsError) {
        throw new Error("assign: O parâmetro 'target' deve ser um objeto.");
      }
      return null;
    }
    if (source === null || typeof source !== "object") {
      if (throwsError) {
        throw new Error("assign: O parâmetro 'source' deve ser um objeto.");
      }
      return null;
    }

    try {
      // Usa cloneDeep para evitar a mutação dos objetos originais.
      // Object.assign realiza a fusão superficial dos objetos já clonados.
      return Object.assign(cloneDeep(target), cloneDeep(source));
    } catch (error) {
      if (throwsError) {
        // Re-lança o erro original para preservar o stack trace e a mensagem específica.
        throw error;
      }
      // Retorna null para manter a consistência com a validação de parâmetros.
      return null;
    }
  }

  // ------------------------------------------------------------------------------------------------

  export default assign;

  // ------------------------------------------------------------------------------------------------