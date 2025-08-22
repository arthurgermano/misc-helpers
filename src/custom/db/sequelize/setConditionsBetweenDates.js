/**
 * @fileoverview Utilitário para formatar condições de busca por intervalo de datas
 * em objetos de consulta, com dependências de conversão e ajuste de data/hora.
 */

// --- Dependências do Módulo ---
const { DATE_BR_FORMAT_D } = require("../../../constants.js");
const stringToDate = require("../../../utils/stringToDate.js");
const dateFirstHourOfDay = require("../../../utils/dateFirstHourOfDay.js");
const dateLastHourOfDay = require("../../../utils/dateLastHourOfDay.js");

// ------------------------------------------------------------------------------------------------

/**
 * Cria uma condição de busca por intervalo de datas (BETWEEN) em um objeto.
 *
 * @summary Formata um intervalo de datas para uma condição de ORM.
 * @description Esta função modifica um objeto de consulta, convertendo strings de data em
 * objetos `Date` e criando uma cláusula `$and` com condições `$gte` (maior ou igual a)
 * e/ou `$lte` (menor ou igual a).
 *
 * **Efeitos Colaterais:**
 * 1.  Adiciona uma nova chave (`key`) ao objeto com a condição de intervalo.
 * 2.  **Remove** as chaves originais de data (`afterKey`, `beforeKey`) do objeto.
 *
 * @param {object} object - O objeto de consulta que será **modificado**.
 * @param {string} [fromFormat=DATE_BR_FORMAT_D] - O formato em que as strings de data de entrada estão.
 * @param {string} [key="created_at"] - A chave principal no objeto onde a condição `$and` será criada.
 * @param {string} [beforeKey="created_at_until"] - A chave que contém a data final do intervalo (`<=`).
 * @param {string} [afterKey="created_at_from"] - A chave que contém a data inicial do intervalo (`>=`).
 * @param {boolean} [resetHMS=true] - Se `true`, ajusta a data inicial para o primeiro momento do dia (00:00:00) e a data final para o último (23:59:59).
 * @returns {object|null} Retorna o objeto modificado se alguma condição for aplicada, ou `null` se nenhuma for.
 *
 * @example
 * // Filtro de entrada
 * const filter = { created_at_from: '01-08-2025', created_at_until: '18-08-2025' };
 *
 * setConditionBetweenDates(filter);
 *
 * // O objeto 'filter' é modificado para:
 * // {
 * //   created_at: {
 * //     $and: [
 * //       { $gte: new Date('2025-08-01T00:00:00.000') },
 * //       { $lte: new Date('2025-08-18T23:59:59.999') }
 * //     ]
 * //   }
 * // }
 * // Note que 'created_at_from' e 'created_at_until' foram removidos.
 */
function setConditionBetweenDates(
  object,
  fromFormat = DATE_BR_FORMAT_D,
  key = "created_at",
  beforeKey = "created_at_until",
  afterKey = "created_at_from",
  resetHMS = true
) {
  // Guarda de validação: retorna null se o objeto não existir ou se nenhuma das chaves de
  // intervalo de data estiver presente, mantendo o comportamento original.
  if (!object || (!object[afterKey] && !object[beforeKey])) {
    return null;
  }

  const conditions = [];

  // Processa a data inicial do intervalo ('de')
  if (object[afterKey]) {
    // Converte a string de data para um objeto Date.
    const fromDate = stringToDate(object[afterKey], fromFormat);

    // Ajusta a data para o início do dia, se solicitado.
    const finalDate = resetHMS ? dateFirstHourOfDay(fromDate) : fromDate;

    conditions.push({ $gte: finalDate });

    // Remove a chave original do objeto, conforme a lógica original.
    delete object[afterKey];
  }

  // Processa a data final do intervalo ('até')
  if (object[beforeKey]) {
    const untilDate = stringToDate(object[beforeKey], fromFormat);

    // Ajusta a data para o final do dia, se solicitado.
    const finalDate = resetHMS ? dateLastHourOfDay(untilDate) : untilDate;

    conditions.push({ $lte: finalDate });

    // Remove a chave original do objeto.
    delete object[beforeKey];
  }

  // Adiciona a nova chave de condição ao objeto.
  object[key] = {
    $and: conditions,
  };

  // Retorna o objeto modificado, mantendo o comportamento original.
  return object;
}

// ------------------------------------------------------------------------------------------------
module.exports = setConditionBetweenDates;
// ------------------------------------------------------------------------------------------------
