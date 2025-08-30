/**
 * @file Módulo utilitário para cópia profunda e manipulação de objetos.
 * @summary Fornece uma função `copyObject` para criar cópias profundas de objetos com opções de transformação.
 */

import cloneDeep from "lodash.clonedeep";
import cleanObject from "./cleanObject";

/**
 * @summary Cria uma cópia profunda (deep copy) de um objeto, com opções para excluir chaves e limpar valores vazios.
 *
 * @description
 * Esta função utiliza `lodash.clonedeep` para criar uma cópia robusta e totalmente independente do objeto de origem,
 * garantindo a imutabilidade. Após a cópia, ela permite duas transformações opcionais:
 * 1. **Exclusão de Chaves:** Remove propriedades especificadas na opção `exclude`.
 * 2. **Limpeza de Objeto:** Se a opção `cleanObject` for `true`, o resultado é passado por uma função de limpeza
 * para remover chaves com valores `undefined`, `null` ou vazios.
 *
 * @param {object} source - O objeto a ser copiado.
 * @param {object} [options={}] - Objeto de configuração para a operação de cópia.
 * @param {(string|symbol)[]} [options.exclude=[]] - Um array de chaves (string ou symbol) que devem ser omitidas da cópia final.
 * @param {boolean} [options.cleanObject=false] - Se `true`, o objeto copiado será passado pela função `cleanObject` para remover propriedades vazias.
 * @param {boolean} [options.throwsError=true] - Se `true`, a função lançará exceções em caso de parâmetros inválidos. Se `false`, retornará `null`.
 *
 * @returns {object | null} Retorna um **novo** objeto, profundamente copiado e opcionalmente modificado,
 * ou `null` se `throwsError` for `false` e ocorrer um erro.
 *
 * @throws {TypeError} Lança um erro se o `source` não for um objeto válido e `throwsError` for `true`.
 *
 * @example
 * // Exemplo 1: Cópia profunda simples
 * const original = { a: 1, b: { c: 2 } };
 * const copia = copyObject(original);
 * copia.b.c = 99;
 * // original.b.c ainda é 2.
 *
 * @example
 * // Exemplo 2: Cópia com exclusão de chaves
 * const user = { id: 123, name: 'John', password: 'abc' };
 * const safeUser = copyObject(user, { exclude: ['password'] });
 * // safeUser -> { id: 123, name: 'John' }
 *
 * @example
 * // Exemplo 3: Cópia com limpeza de objeto
 * const messyObject = { a: 1, b: null, c: undefined, d: 'hello', e: '' };
 * const clean = copyObject(messyObject, { cleanObject: true });
 * // clean -> { a: 1, d: 'hello' } (dependendo da implementação de cleanObject)
 *
 * @example
 * // Exemplo 4: Usando todas as opções
 * const fullObject = { id: 1, data: null, token: 'xyz', user: 'admin' };
 * const finalObject = copyObject(fullObject, { exclude: ['token'], cleanObject: true });
 * // finalObject -> { id: 1, user: 'admin' }
 */
function copyObject(source = {}, options = {}) {
  const {
    exclude = [],
    throwsError = true,
    cleanObject: shouldClean = false,
  } = options;

  // Validação do parâmetro de entrada principal.
  if (source === null || typeof source !== "object") {
    if (throwsError) {
      throw new TypeError(
        "copyObject: O parâmetro 'source' deve ser um objeto."
      );
    }
    return null;
  }

  try {
    // Etapa 1: A base da operação é uma cópia profunda e segura.
    let result = cloneDeep(source);

    // Etapa 2: Aplicar a lógica de exclusão, se aplicável.
    if (exclude.length > 0) {
      for (const key of exclude) {
        // A remoção é feita na cópia, não no objeto original.
        delete result[key];
      }
    }

    // Etapa 3: Aplicar a limpeza, se solicitado.
    if (shouldClean) {
      result = cleanObject(result);
    }

    return result;
  } catch (error) {
    // Captura de erro para respeitar a opção 'throwsError'.
    if (throwsError) {
      throw error;
    }
    return null;
  }
}

export default copyObject;
