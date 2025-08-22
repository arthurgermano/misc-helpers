/**
 * @file Utilitário seguro e robusto para conversão de valores para string.
 * @author Seu Nome <seu.email@example.com>
 * @version 2.1.0
 */

/**
 * @summary Converte um valor de qualquer tipo para uma string de forma segura.
 *
 * @description
 * Esta função é uma versão mais robusta do construtor `String()`. Ela prioriza o método
 * `.toString()` customizado de um objeto. Apenas se um objeto não tiver um `.toString()`
 * customizado (resultando no padrão `"[object Object]"`), a função tentará convertê-lo
 * para uma string JSON.
 *
 * @param {*} [textObj=""] - O valor a ser convertido para string.
 * @param {boolean} [objectToJSON=true] - Se `true` e a entrada for um objeto sem `.toString()`
 * customizado, tenta convertê-lo para uma string JSON.
 *
 * @returns {string} A representação do valor como string.
 *
 * @example
 * const custom = { toString: () => 'Custom!' };
 * toString(custom);           // 'Custom!'
 *
 * toString({ a: 1 });         // '{"a":1}'
 * toString({ a: 1 }, false);  // '[object Object]'
 * toString(123);              // '123'
 * toString(null);             // ''
 */
function toString(textObj = "", objectToJSON = true) {
  // 1. Lida com `null` e `undefined` primeiro, retornando uma string vazia.
  if (textObj == null) {
    return "";
  }

  // 2. Realiza a conversão inicial para string.
  // O construtor `String()` invoca corretamente o método `.toString()` do objeto.
  const initialString = String(textObj);

  // 3. Verifica se a conversão inicial resultou na string genérica de objeto.
  // O `typeof` previne que a string literal "[object Object]" seja convertida para JSON.
  if (
    objectToJSON &&
    initialString === '[object Object]' &&
    typeof textObj === 'object'
  ) {
    try {
      // Se for um objeto genérico, tenta uma conversão JSON mais informativa.
      return JSON.stringify(textObj);
    } catch (error) {
      // Se o JSON falhar (ex: referência circular), retorna a string genérica.
      return initialString;
    }
  }

  // 4. Se não for um objeto genérico (ou se for um primitivo, array, ou objeto customizado),
  // a conversão inicial já é a correta.
  return initialString;
}

// ------------------------------------------------------------------------------------------------

module.exports = toString;