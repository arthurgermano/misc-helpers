const isInstanceOf = require("../helpers/isInstanceOf.js");

// ------------------------------------------------------------------------------------------------

/**
 * @file Utilitário para obter o final de um dia a partir de um objeto Date.
 * @author Seu Nome <seu.email@example.com>
 * @version 2.0.0
 */

/**
 * @summary Retorna uma nova data representando o final do dia (23:59:59.999).
 *
 * @description
 * Esta função recebe um objeto `Date` e retorna um **novo** objeto `Date` ajustado para o
 * último momento daquele dia (23:59:59.999), no fuso horário local.
 *
 * A função é **não-mutável**, o que significa que o objeto `Date` original passado como
 * argumento não é modificado.
 *
 * @param {Date} date - O objeto `Date` de referência.
 *
 * @returns {Date | false} Um novo objeto `Date` representando o final do dia, ou `false`
 * se a entrada não for um objeto `Date` válido.
 *
 * @example
 * const dataOriginal = new Date('2025-08-21T15:30:00');
 * const finalDoDia = dateLastHourOfDay(dataOriginal);
 *
 * // O objeto original permanece inalterado
 * console.log(dataOriginal.toLocaleTimeString()); // "15:30:00"
 *
 * // O novo objeto representa o final daquele dia
 * console.log(finalDoDia.toLocaleTimeString());  // "23:59:59"
 */
function dateLastHourOfDay(date) {
  // 1. Validação do tipo e do valor da data.
  // A checagem `isNaN` trata casos como `new Date('data inválida')`.
  if (!isInstanceOf(date, Date) || isNaN(date.getTime())) {
    return false;
  }

  // 2. Cria uma nova instância da data para evitar a mutação do objeto original.
  const newDate = new Date(date.getTime());

  // 3. Define a hora para o último momento do dia.
  // `setHours` pode receber todos os valores de tempo, tornando o código mais conciso.
  newDate.setHours(23, 59, 59, 999);

  return newDate;
}

// ------------------------------------------------------------------------------------------------

module.exports = dateLastHourOfDay;