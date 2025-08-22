const isInstanceOf = require("../helpers/isInstanceOf.js");

// ------------------------------------------------------------------------------------------------

/**
 * @file Utilitário para obter o início de um dia a partir de um objeto Date.
 * @author Seu Nome <seu.email@example.com>
 * @version 2.1.0
 */

/**
 * @summary Retorna uma nova data representando o início do dia (00:00:00).
 *
 * @description
 * Esta função recebe um objeto `Date` e retorna um **novo** objeto `Date` ajustado para o
 * primeiro momento daquele dia (00:00:00.000), no fuso horário local.
 *
 * A função é **não-mutável**, o que significa que o objeto `Date` original passado como
 * argumento não é modificado.
 *
 * @param {Date} date - O objeto `Date` de referência.
 *
 * @returns {Date | false} Um novo objeto `Date` representando o início do dia, ou `false`
 * se a entrada não for um objeto `Date` válido.
 *
 * @example
 * const dataOriginal = new Date('2025-08-21T15:30:00');
 * const inicioDoDia = dateFirstHourOfDay(dataOriginal); // Retorna um novo objeto Date
 *
 * const invalido = dateFirstHourOfDay('não é uma data'); // Retorna false
 */
function dateFirstHourOfDay(date) {
  // 1. Validação do tipo e do valor da data.
  // A checagem `isNaN` trata casos como `new Date('data inválida')`.
  if (!isInstanceOf(date, Date) || isNaN(date.getTime())) {
    // Retorna `false` para alinhar com o comportamento esperado pelos testes.
    return false;
  }

  // 2. Cria uma nova instância da data para evitar a mutação do objeto original.
  const newDate = new Date(date.getTime());

  // 3. Define a hora, minutos, segundos e milissegundos para zero de uma só vez.
  // `setHours(0, 0, 0, 0)` é uma forma concisa e eficiente de zerar o tempo do dia.
  newDate.setHours(0, 0, 0, 0);

  return newDate;
}

// ------------------------------------------------------------------------------------------------

module.exports = dateFirstHourOfDay;