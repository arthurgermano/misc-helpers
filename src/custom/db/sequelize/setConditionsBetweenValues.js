/**
 * @fileoverview Fornece uma função utilitária para formatar condições de busca
 * por intervalo (BETWEEN) em objetos de consulta de banco de dados.
 */

/**
 * Cria uma condição de busca por intervalo (BETWEEN) em um objeto de consulta.
 *
 * @summary Formata um valor de objeto para uma condição de intervalo (BETWEEN) de ORM.
 * @description Modifica um objeto de consulta para adicionar uma cláusula `$and` com condições
 * `$gte` (maior ou igual a) e/ou `$lte` (menor ou igual a). Esta função é útil para filtrar
 * por um intervalo de valores (ex: datas, preços). **A função modifica o objeto de entrada diretamente**.
 *
 * @param {object} object - O objeto de consulta que será **modificado**.
 * @param {string} [key="value"] - A chave principal no objeto onde a condição `$and` será criada.
 * @param {string} [beforeKey="value_until"] - A chave no objeto que contém o valor final do intervalo (`<=`).
 * @param {string} [afterKey="value_from"] - A chave no objeto que contém o valor inicial do intervalo (`>=`).
 * @returns {object|void} Retorna o objeto modificado se ao menos uma condição (`beforeKey` ou `afterKey`)
 * for aplicada. Retorna `undefined` (implicitamente) se nenhuma condição for encontrada no objeto.
 * @example
 * // Caso com ambas as chaves
 * const query = { value_from: '2025-01-01', value_until: '2025-01-31' };
 * setConditionBetweenValues(query);
 * // query é modificado para:
 * // {
 * //   value_from: '2025-01-01',
 * //   value_until: '2025-01-31',
 * //   value: { $and: [ { $gte: '2025-01-01' }, { $lte: '2025-01-31' } ] }
 * // }
 *
 * // Caso com apenas a chave inicial
 * const query2 = { value_from: 100 };
 * setConditionBetweenValues(query2);
 * // query2 é modificado para: { value_from: 100, value: { $and: [ { $gte: 100 } ] } }
 */
function setConditionBetweenValues(
  object,
  key = "value",
  beforeKey = "value_until",
  afterKey = "value_from"
) {
  // Guarda de validação: se o objeto não existe, ou se nenhuma das chaves de
  // intervalo (`afterKey` ou `beforeKey`) está presente, a função não faz nada.
  // Preserva o retorno implícito de `undefined` do código original.
  if (!object || (!object[afterKey] && !object[beforeKey])) {
    return;
  }

  const conditions = [];

  // Adiciona a condição de limite inferior se a chave correspondente existir.
  if (object[afterKey]) {
    conditions.push({ $gte: object[afterKey] });
  }

  // Adiciona a condição de limite superior se a chave correspondente existir.
  if (object[beforeKey]) {
    conditions.push({ $lte: object[beforeKey] });
  }

  // Atribui a nova estrutura de condição ao objeto na chave especificada.
  object[key] = {
    $and: conditions,
  };

  // Preserva o retorno do objeto modificado do código original.
  return object;
}

// ------------------------------------------------------------------------------------------------
module.exports = setConditionBetweenValues;
// ------------------------------------------------------------------------------------------------
