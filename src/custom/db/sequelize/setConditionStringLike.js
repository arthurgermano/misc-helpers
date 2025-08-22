/**
 * @fileoverview Fornece uma função utilitária para formatar condições de busca
 * textual (LIKE) em objetos de consulta de banco de dados.
 */

/**
 * Modifica um objeto para criar uma condição de busca textual (LIKE/ILIKE).
 *
 * @summary Formata um valor de objeto para uma condição LIKE de ORM.
 * @description Esta função é um utilitário para construir cláusulas de consulta para ORMs (como Sequelize).
 * Ela pega o valor de uma chave no objeto, o envolve com wildcards (`%`) e o reatribui
 * à mesma chave no formato `{ $iLike: '%valor%' }` ou `{ $like: '%valor%' }`.
 * A função modifica o objeto de entrada diretamente (mutação).
 *
 * @param {object} object - O objeto de consulta que será **modificado**.
 * @param {string} key - A chave no objeto cujo valor será formatado.
 * @param {boolean} [insensitive=true] - Se `true`, usa `$iLike` (case-insensitive). Se `false`, usa `$like` (case-sensitive).
 * @returns {void} Esta função não retorna um valor; ela modifica o objeto passado como referência.
 * @example
 * const query = { name: 'Maria' };
 * setConditionStringLike(query, 'name');
 * // O objeto 'query' agora é: { name: { $iLike: '%Maria%' } }
 *
 * const filter = { email: 'TESTE@' };
 * setConditionStringLike(filter, 'email', false);
 * // O objeto 'filter' agora é: { email: { $like: '%TESTE@%' } }
 *
 * const emptyQuery = { name: '' };
 * setConditionStringLike(emptyQuery, 'name');
 * // O objeto 'emptyQuery' não é modificado, pois o valor inicial é "falsy".
 */
function setConditionStringLike(object, key, insensitive = true) {
  // Guarda de validação: se o objeto, a chave ou o valor na chave não existirem
  // ou forem "falsy" (como uma string vazia), a função não faz nada.
  if (!object || !key || !object[key]) {
    return;
  }

  // Determina o operador a ser usado com base na opção 'insensitive'.
  const operator = insensitive ? '$iLike' : '$like';
  
  // Armazena o valor original para evitar problemas na reatribuição.
  const value = object[key];

  // Modifica o objeto, reatribuindo a chave com a nova estrutura de condição.
  // Usa a sintaxe de nome de propriedade computada ([operator]) para definir a chave dinamicamente.
  object[key] = {
    [operator]: `%${value}%`,
  };
}

// ------------------------------------------------------------------------------------------------
module.exports = setConditionStringLike;
// ------------------------------------------------------------------------------------------------