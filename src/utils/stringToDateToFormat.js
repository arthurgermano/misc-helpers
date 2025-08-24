import { DATE_ISO_FORMAT, DATE_BR_HOUR_FORMAT_D } from "../constants.js";
import stringToDate from "./stringToDate.js";
import dateToFormat from "./dateToFormat.js";

// ------------------------------------------------------------------------------------------------

/**
 * @file Utilitário para re-formatar strings de data.
 */

/**
 * @summary Re-formata uma string de data de um formato de entrada para um de saída.
 *
 * @description
 * Esta função é um utilitário de conveniência que combina a análise e a formatação
 * de datas em uma única etapa. Ela usa `stringToDate` para converter a string de entrada em um
 * objeto `Date` e, em seguida, usa `dateToFormat` para converter esse objeto de volta
 * para uma string no formato de saída desejado.
 *
 * @param {string} stringDate - A string da data a ser re-formatada.
 * @param {string} [fromFormat=DATE_ISO_FORMAT] - O padrão de formatação da string de entrada.
 * @param {string} [toFormat=DATE_BR_HOUR_FORMAT_D] - O padrão de formatação desejado para a saída.
 *
 * @returns {string | false} A nova string de data formatada, ou `false` se a
 * análise da data de entrada falhar.
 */
function stringToDateToFormat(
  stringDate,
  fromFormat = DATE_ISO_FORMAT,
  toFormat = DATE_BR_HOUR_FORMAT_D
) {
  try {
    // 1. Converte a string de entrada para um objeto Date.
    // `stringToDate` retorna um Date cujo tempo UTC corresponde aos números da string.
    const dateObject = stringToDate(stringDate, fromFormat, false);

    if (dateObject) {
      // 2. Reverte o ajuste de fuso horário antes de formatar.
      // `stringToDate` removeu o offset local para tratar a hora como UTC.
      // Para que `dateToFormat` (que formata em hora local) exiba os números corretos,
      // é necessário adicionar o offset de volta, criando uma nova data ajustada.
      const timezoneOffsetMillis = dateObject.getTimezoneOffset() * 60 * 1000;
      const localDate = new Date(dateObject.getTime() + timezoneOffsetMillis);

      // 3. Formata o objeto Date (agora ajustado para a hora local correta) para a string de saída.
      return dateToFormat(localDate, toFormat);
    }
  } catch (_) {}
  // 4. Se a conversão inicial falhou, retorna `false`.
  return false;
}

// ------------------------------------------------------------------------------------------------

export default stringToDateToFormat;
