/**
 * @file Utilitário cross-environment para decodificação de Base64.
 */

/**
 * @summary Decodifica uma string em Base64 para uma string de texto UTF-8.
 *
 * @description
 * Esta função fornece uma maneira robusta e compatível com múltiplos ambientes (Node.js e navegadores)
 * para decodificar uma string Base64. Ela detecta automaticamente o ambiente de execução e utiliza
 * as APIs nativas mais apropriadas para garantir a máxima performance e corretude.
 *
 * A implementação lida corretamente com caracteres multi-byte (UTF-8), como acentos e emojis,
 * que são frequentemente corrompidos pela função `atob()` nativa do navegador.
 *
 * @param {string} [text=""] - A string em formato Base64 a ser decodificada.
 *
 * @returns {string} A string decodificada em UTF-8. Retorna uma string vazia se a entrada
 * for inválida, vazia ou se ocorrer um erro durante a decodificação.
 *
 * @example
 * // Decodificando texto ASCII simples
 * const hello = base64From('SGVsbG8gV29ybGQh');
 * console.log(hello); // "Hello World!"
 *
 * // Decodificando texto com caracteres UTF-8 (acentos e símbolos)
 * const complex = base64From('U3VjZXNzbyEg4pyT');
 * console.log(complex); // "Sucesso! ✓"
 */
function base64From(text = "") {
  // Valida a entrada para garantir que é uma string não vazia.
  if (typeof text !== "string" || text.length === 0) {
    return "";
  }

  try {
    // A maneira padrão de verificar se o código está rodando fora de um navegador (ex: Node.js).
    if (typeof window === "undefined") {
      // **Ambiente Node.js:**
      // Utiliza a classe `Buffer`, que é altamente otimizada e a forma canônica
      // de lidar com dados binários e encodings no Node.js.
      return Buffer.from(text, "base64").toString("utf-8");
    }
    // **Ambiente do Navegador:**
    // A função `atob()` sozinha não lida bem com caracteres UTF-8.
    // A abordagem moderna abaixo garante a decodificação correta.
    const binaryString = window.atob(text);

    // Converte a string binária decodificada em um array de bytes (Uint8Array).
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // A API `TextDecoder` interpreta corretamente o array de bytes como uma string UTF-8.
    return new window.TextDecoder().decode(bytes);
  } catch (error) {
    // Captura exceções que podem ocorrer se a string `text` não for um Base64 válido.
    // Retorna uma string vazia para um comportamento consistente e previsível.
    // console.error("Falha ao decodificar Base64:", error); // Descomente para depuração
    return "";
  }
}

// ------------------------------------------------------------------------------------------------

export default base64From;
