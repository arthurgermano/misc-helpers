import { DATE_ISO_FORMAT } from "../constants.js";
import { parse } from "date-fns/parse";
import isInstanceOf from "../helpers/isInstanceOf";

// ------------------------------------------------------------------------------------------------

/**
 * @summary Converte uma string para um objeto Date, com base em um padrão de formato.
 *
 * @description
 * Esta função utiliza a biblioteca `date-fns` para analisar uma string de data com um
 * formato específico e retornar um objeto `Date`.
 *
 * Um passo importante desta função é que ela trata os valores da string como se
 * estivessem em UTC. Por exemplo, a string "2025-08-21 10:30:00" (sem fuso) será convertida para
 * um objeto `Date` que, em UTC, representa `2025-08-21T10:30:00.000Z`.
 *
 * @param {string} stringDate - A string da data a ser analisada.
 * @param {string} [stringFormat=DATE_ISO_FORMAT] - O padrão de formatação da `stringDate`,
 * compatível com `date-fns`.
 * @param {Date} [defaultDate=new Date()] - O valor a ser retornado se a análise falhar.
 * Se `defaultDate` for `null` ou `undefined`, a função retorna `false`.
 *
 * @returns {Date | false} O objeto `Date` resultante, o `defaultDate` em caso de falha,
 * ou `false` se a análise falhar e não houver `defaultDate`.
 */
function stringToDate(
  stringDate,
  stringFormat = DATE_ISO_FORMAT,
  defaultDate = new Date()
) {
  let dateToProcess;

  // 1. Tenta analisar a string ou define o fallback inicial.
  if (typeof stringDate === 'string') {
    const parsedDate = parse(stringDate, stringFormat, new Date());

    // Verifica se a análise foi bem-sucedida.
    if (isInstanceOf(parsedDate, Date) && !isNaN(parsedDate.getTime())) {
      dateToProcess = parsedDate;
    } else {
      // Se a análise falhar, usa a data padrão como fallback.
      dateToProcess = defaultDate;
    }
  } else {
    // Se a entrada não for uma string, usa a data padrão.
    dateToProcess = defaultDate;
  }

  // 2. Valida a data a ser processada (seja ela a analisada ou a padrão).
  if (dateToProcess == null) {
    // Se a data padrão era nula/indefinida, retorna `false`.
    return false;
  }
  
  if (!isInstanceOf(dateToProcess, Date) || isNaN(dateToProcess.getTime())) {
      // Se a data padrão fornecida for inválida, retorna `false`.
      return false;
  }

  // 3. Aplica o ajuste de fuso horário a QUALQUER data válida que saia da função.
  // Isso garante um comportamento consistente tanto para datas analisadas quanto para as padrão.
  const timezoneOffsetMillis = dateToProcess.getTimezoneOffset() * 60 * 1000;
  return new Date(dateToProcess.getTime() - timezoneOffsetMillis);
}

// ------------------------------------------------------------------------------------------------

export default stringToDate;