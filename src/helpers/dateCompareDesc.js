/**
 * @fileoverview Fornece uma função para comparar se uma data é posterior a outra.
 * O código é compatível com ambientes Node.js e navegadores.
 */

/**
 * Compara duas datas para determinar se a primeira (dateA) é posterior à segunda (dateB).
 *
 * @summary Verifica se a data A é posterior à data B.
 * @description Esta função compara duas instâncias de Date. Ela oferece opções para
 * ignorar a parte de horas/minutos/segundos, incluir datas iguais na validação e
 * controlar o comportamento em caso de erro.
 *
 * @param {Date} dateA A data que se espera ser a mais recente.
 * @param {Date} dateB A data que se espera ser a mais antiga.
 * @param {object} [options={}] Opções para customizar o comportamento da comparação.
 * @param {boolean} [options.considerHMS=false] Se `true`, a comparação inclui horas, minutos e segundos. Se `false`, apenas ano, mês e dia são considerados.
 * @param {boolean} [options.considerEquals=false] Se `true`, a função retorna `true` caso as datas sejam idênticas. Se `false`, retorna `false`.
 * @param {boolean} [options.ignoreErrors=false] Se `true`, retorna `null` caso os parâmetros não sejam instâncias de Date. Se `false`, lança um erro.
 * @returns {boolean|null} Retorna `true` se `dateA` for posterior (ou igual, se `considerEquals` for `true`) a `dateB`. Retorna `null` em caso de erro com `ignoreErrors` ativado.
 * @throws {Error} Lança um erro se `dateA` ou `dateB` não forem objetos Date e `ignoreErrors` for `false`.
 */
function dateCompareDesc(dateA, dateB, options = {}) {
  // 1. Configuração e Validação dos Parâmetros
  const finalOptions = {
    considerHMS: false,
    ignoreErrors: false,
    considerEquals: false,
    ...options,
  };

  // Valida 'dateA' e mantém a mensagem de erro original.
  if (!(dateA instanceof Date)) {
    if (finalOptions.ignoreErrors) {
      return null;
    }
    throw new Error(
      "dateCompareDesc Function: dateA provided is not a Date Object"
    );
  }

  // Valida 'dateB' e mantém a mensagem de erro original.
  if (!(dateB instanceof Date)) {
    if (finalOptions.ignoreErrors) {
      return null;
    }
    throw new Error(
      "dateCompareDesc Function: dateB provided is not a Date Object"
    );
  }

  // 2. Lógica de Comparação
  try {
    let timeA;
    let timeB;

    // Remove a parte de horas, minutos e segundos, se a opção estiver desativada.
    if (!finalOptions.considerHMS) {
      timeA = new Date(
        dateA.getFullYear(),
        dateA.getMonth(),
        dateA.getDate()
      ).getTime();
      timeB = new Date(
        dateB.getFullYear(),
        dateB.getMonth(),
        dateB.getDate()
      ).getTime();
    } else {
      timeA = dateA.getTime();
      timeB = dateB.getTime();
    }

    // A expressão booleana combina as duas condições para um retorno verdadeiro.
    // 1. timeA é estritamente maior que timeB.
    // 2. timeA é igual a timeB E a opção 'considerEquals' está ativada.
    return timeA > timeB || (timeA === timeB && finalOptions.considerEquals);
  } catch (error) {
    if (finalOptions.ignoreErrors) {
      return null;
    }
    // Re-lança o erro original se a opção de ignorar não estiver ativa.
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------
module.exports = dateCompareDesc;
// ------------------------------------------------------------------------------------------------
