import isNumber from "../helpers/isNumber";
import toString from "./toString";
// ------------------------------------------------------------------------------------------------

/**
 * @summary Codifica uma string para o formato Base64 sem padding, de forma isomórfica.
 *
 * @description
 * Esta função detecta o ambiente de execução (Node.js ou Navegador) e codifica
 * o texto de entrada para uma string Base64, removendo os caracteres de padding (`=`) no final.
 *
 * - **No Node.js:** A função é mais robusta, utilizando `Buffer.from()`. Ela pode converter
 * números para strings e aceita um `fromFormat` para especificar a codificação do texto
 * de entrada (ex: 'utf-8').
 * - **No Navegador:** A função utiliza `btoa()`, que opera sobre "strings binárias".
 *
 *
 * @param {string|number} [text=""] - O texto a ser codificado. Se for um número, será convertido para string (apenas no Node.js).
 * @param {string} [fromFormat] - A codificação do texto de entrada (ex: 'utf-8', 'binary').
 * **Este parâmetro é utilizado apenas no ambiente Node.js.**
 * @returns {string} A string codificada em Base64, sem os caracteres de padding (`=`).
 */
function base64To(text = "", fromFormat) {
  let b64;
  if (typeof window === "undefined") {
    if (isNumber(text)) {
      text = toString(text);
    }
    b64 = Buffer.from(text, fromFormat).toString("base64");
  } else {
    b64 = btoa(text);
  }
  return b64.replaceAll("=", "");
}

// ------------------------------------------------------------------------------------------------

export default base64To;