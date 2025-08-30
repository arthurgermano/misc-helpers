/**
 * @file Módulo utilitário para mesclagem profunda e imutável de objetos.
 * @summary Fornece uma função `assign` robusta, implementada com as utilidades do Lodash para máxima confiabilidade e tratamento de casos extremos.
 */

import cloneDeep from "lodash.clonedeep";
import mergewith from "lodash.mergewith";

/**
 * @private
 * @summary Função customizadora para `lodash.mergewith`.
 * @description Garante que valores do tipo Array ou TypedArray (ex: Uint8Array) do objeto `source`
 * substituam completamente os valores do `target`, em vez de serem mesclados. Para outros tipos,
 * retorna `undefined` para que o `mergewith` utilize seu comportamento padrão de mesclagem.
 * @param {*} objValue - O valor do objeto de destino (não utilizado neste customizer).
 * @param {*} srcValue - O valor do objeto de origem que está sendo mesclado.
 * @returns {*|undefined} O valor de origem (`srcValue`) se for um array/TypedArray, ou `undefined`.
 */
const customizer = (objValue, srcValue) => {
  if (Array.isArray(srcValue) || ArrayBuffer.isView(srcValue)) {
    return srcValue;
  }
};

/**
 * @summary Realiza a mesclagem profunda (deep merge) e imutável de dois objetos.
 *
 * @description
 * Combina as propriedades de um objeto `source` em um `target`, retornando um objeto inteiramente novo.
 * A função é projetada para ser robusta, utilizando `lodash.mergewith` e `lodash.clonedeep`
 * para garantir performance, imutabilidade e tratamento correto de casos extremos como
 * dependências circulares.
 *
 * Principais Comportamentos:
 * - **Imutabilidade:** Os objetos `target` and `source` originais nunca são modificados.
 * - **Mesclagem Profunda:** Objetos aninhados são mesclados recursivamente.
 * - **Tratamento de Arrays:** Arrays e TypedArrays (ex: `Uint8Array`) do `source` substituem os do `target`.
 * - **Tratamento de Symbols:** Propriedades com chaves do tipo `Symbol` são corretamente copiadas do `source`.
 *
 * @param {object} target - O objeto base sobre o qual a mesclagem será aplicada.
 * @param {object} source - O objeto cujas propriedades serão mescladas no `target`.
 * @param {object} [options={}] - Objeto de configuração para a operação de mesclagem.
 * @param {(string|symbol)[]} [options.exclude=[]] - Um array de chaves que devem ser completamente omitidas.
 * Note: As chaves listadas aqui serão removidas tanto do `target` quanto do `source` antes da mesclagem.
 * @param {boolean} [options.throwsError=true] - Se `true`, a função lançará exceções em caso de
 * parâmetros inválidos. Se `false`, retornará `null` silenciosamente.
 *
 * @returns {object | null} Retorna um **novo** objeto contendo o resultado da mesclagem,
 * ou `null` se `throwsError` for `false` e ocorrer um erro.
 *
 * @throws {TypeError} Lança um erro se `target` ou `source` não forem objetos.
 *
 * @example
 * // Mesclagem profunda de configurações
 * const defaultConfig = { api: { host: 'api.example.com', port: 443 }, user: { theme: 'dark' } };
 * const userConfig = { api: { port: 8080 }, user: { name: 'Admin', theme: 'light' } };
 * const finalConfig = assign(defaultConfig, userConfig);
 * // finalConfig -> { api: { host: 'api.example.com', port: 8080 }, user: { name: 'Admin', theme: 'light' } }
 *
 * @example
 * // Usando a opção 'exclude' para remover chaves do resultado final
 * const userData = { id: 123, name: 'John', role: 'user' };
 * const updatePayload = { name: 'John Doe', role: 'admin' };
 * const safeUpdate = assign(userData, updatePayload, { exclude: ['role'] });
 * // safeUpdate -> { id: 123, name: 'John Doe' }
 * // A chave 'role' foi removida do resultado.
 */
function assign(target = {}, source = {}, options = {}) {
  let { exclude = [], throwsError = true } = options;

  // Bloco de validação para garantir a integridade dos parâmetros.
  if (target === null || typeof target !== "object" || Array.isArray(target)) {
    if (throwsError)
      throw new TypeError("assign: O parâmetro 'target' deve ser um objeto.");
    return null;
  }
  if (source === null || typeof source !== "object" || Array.isArray(source)) {
    if (throwsError)
      throw new TypeError("assign: O parâmetro 'source' deve ser um objeto.");
    return null;
  }
  // Garante que 'exclude' seja sempre um array para evitar erros posteriores.
  if (!Array.isArray(exclude)) {
    exclude = [];
  }

  try {
    // Etapa 1: Clonar ambos os objetos para garantir a imutabilidade dos originais.
    const sourceToMerge = cloneDeep(source);
    const targetToMerge = cloneDeep(target);

    // Etapa 2: Aplicar a lógica de exclusão, se aplicável.
    if (exclude.length > 0) {
      for (const key of exclude) {
        // Remove as chaves especificadas de ambas as cópias.
        // Isso garante que a chave não existirá no resultado final.
        delete sourceToMerge[key];
        delete targetToMerge[key];
      }
    }

    // Etapa 3: Realizar a mesclagem profunda.
    // O `mergewith` modifica o primeiro argumento, por isso operamos sobre a cópia `targetToMerge`.
    const result = mergewith(targetToMerge, sourceToMerge, customizer);

    // Etapa 4: Tratamento explícito para propriedades com chave Symbol.
    // Esta etapa corrige uma limitação do `lodash.merge` que não copia Symbols do `source`.
    const sourceSymbols = Object.getOwnPropertySymbols(source);
    for (const symbolKey of sourceSymbols) {
      // A chave de Símbolo só é copiada se não estiver na lista de exclusão.
      if (!exclude.includes(symbolKey)) {
        // O valor é clonado para manter a consistência da imutabilidade.
        result[symbolKey] = cloneDeep(source[symbolKey]);
      }
    }

    return result;
  } catch (error) {
    // Captura de erro para respeitar a opção `throwsError`.
    if (throwsError) {
      throw error;
    }
    return null;
  }
}

export default assign;