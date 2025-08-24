import toString from "./toString.js";
import isNumber from "../helpers/isNumber.js";

// ------------------------------------------------------------------------------------------------

/**
 * @file Utilitário para converter strings de moeda brasileira (BRL) para um número.
 */

/**
 * @summary Converte uma string de moeda no formato brasileiro (BRL) para um número de ponto flutuante.
 *
 * @description
 * Esta função analisa uma string que representa um valor monetário em Reais (ex: "R$ 1.234,56")
 * e a converte para um número puro (ex: 1234.56). Se a entrada já for um número válido,
 * ela é retornada diretamente.
 *
 * @param {string | number} moneyValue - O valor monetário a ser convertido.
 *
 * @returns {number | false} O número de ponto flutuante correspondente, ou `false` se a
 * conversão falhar ou a entrada for inválida.
 *
 * @example
 * currencyBRToFloat("R$ 1.234,56"); // Retorna 1234.56
 * currencyBRToFloat("1A23,45");      // Retorna false
 * currencyBRToFloat("");            // Retorna false
 * currencyBRToFloat(150.75);        // Retorna 150.75
 */
function currencyBRToFloat(moneyValue) {
  // 1. Validação de Entrada
  // Retorna `false` para entradas nulas ou indefinidas.
  if (moneyValue == null) {
    return false;
  }

  // Se a entrada já for um número válido, retorna-o diretamente.
  if (isNumber(moneyValue)) {
    return moneyValue;
  }

  // 2. Limpeza e Formatação da String
  const cleanedString = toString(moneyValue)
    // Remove o símbolo 'R$', espaços em branco e pontos (separador de milhar).
    .replace(/R\$|\s|\./g, "")
    // Substitui a vírgula (separador decimal brasileiro) por um ponto.
    .replace(",", ".");

  // 3. Validação de Caracteres Inválidos
  // Esta verificação impede que `parseFloat` interprete parcialmente uma string
  // inválida (ex: "1A2B" se tornaria 1). A regex `/[^0-9.]/` procura por
  // qualquer caractere que não seja um dígito (0-9) ou um ponto (.).
  if (/[^0-9.]/.test(cleanedString)) {
    return false;
  }

  // Se a string ficar vazia ou contiver apenas um ponto após a limpeza, é inválida.
  if (cleanedString === "" || cleanedString === ".") {
    return false;
  }
  
  // 4. Conversão e Validação Final
  const result = parseFloat(cleanedString);

  // Verifica se o resultado do `parseFloat` é um número finito.
  if (isNumber(result)) {
    return result;
  }

  // Se a conversão falhou, retorna `false`.
  return false;
}

// ------------------------------------------------------------------------------------------------

export default currencyBRToFloat;