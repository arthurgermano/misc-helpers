import { DATE_BR_FORMAT_D } from "../constants.js";
import { format } from "date-fns/format";
import isInstanceOf from "../helpers/isInstanceOf.js";

// ------------------------------------------------------------------------------------------------

/**
 * @file Utilitário para formatar objetos Date em strings usando date-fns.
 */

/**
 * @summary Formata um objeto Date em uma string, com base em um padrão de formato.
 *
 * @description
 * Esta função atua como um wrapper seguro para a função `format` da biblioteca `date-fns`.
 * Ela adiciona uma camada de validação robusta para garantir que apenas objetos `Date`
 * válidos sejam passados para a função de formatação, prevenindo erros.
 *
 * @param {Date} date - O objeto `Date` a ser formatado.
 * @param {string} [stringFormat=DATE_BR_FORMAT_D] - O padrão de formatação, compatível
 * com `date-fns`. O padrão no Brasil é 'dd/MM/yyyy'.
 *
 * @returns {string | false} A string da data formatada, ou `false` se a entrada
 * não for um objeto `Date` válido.
 *
 * @example
 * const myDate = new Date('2025-08-21T15:30:45');
 * dateToFormat(myDate); // "21/08/2025" (usando o padrão)
 * dateToFormat(myDate, 'yyyy-MM-dd HH:mm:ss.SSS'); // "2025-08-21 15:30:45.000"
 * dateToFormat('texto invalido'); // false
 */
function dateToFormat(date, stringFormat = DATE_BR_FORMAT_D) {
  // 1. Validação do tipo e do valor da data.
  // A checagem `isNaN` trata casos como `new Date('data inválida')`.
  if (!isInstanceOf(date, Date) || isNaN(date.getTime())) {
    // Retorna o booleano `false` para manter a consistência com os testes do projeto.
    return false;
  }

  // 2. Delega a formatação para a função `format` da biblioteca `date-fns`.
  // Isso garante suporte completo a todos os tokens de formato que a biblioteca oferece.
  return format(date, stringFormat);
}

// ------------------------------------------------------------------------------------------------

export default dateToFormat;