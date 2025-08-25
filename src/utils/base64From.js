/**
 * @summary Decodifica uma string Base64 para texto de forma isomórfica.
 *
 * @description
 * Esta função detecta o ambiente de execução (Node.js ou Navegador) para decodificar
 * uma string no formato Base64.
 *
 * - **No Node.js:** A função decodifica a string Base64 para uma string de texto no formato UTF-8,
 * lidando corretamente com acentuação e caracteres especiais.
 * - **No Navegador:** A função utiliza `atob()`, que decodifica a string Base64 para uma
 * "string binária". Cada caractere na string de saída representa um byte dos dados originais.
 *
 *
 * @param {string} [text=""] - A string no formato Base64 a ser decodificada.
 * @returns {string} Uma string decodificada. No Node.js, será uma string UTF-8. No navegador,
 * será uma "string binária". Retorna uma string vazia se a entrada for inválida.
 */
function base64From(text = "") {
  if (typeof text != "string" || !text) {
    return "";
  }
  if (typeof window === "undefined") {
    return Buffer.from(text, "base64").toString("utf-8");
  }
  return atob(text);
}

// ------------------------------------------------------------------------------------------------

export default base64From;