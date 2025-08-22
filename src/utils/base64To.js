/**
 * @file Utilitário cross-environment para codificação em Base64.
 * @author Seu Nome <seu.email@example.com>
 * @version 2.0.0
 */

/**
 * @summary Codifica uma string, Buffer ou número para o formato Base64 (sem preenchimento).
 *
 * @description
 * Esta função é cross-environment, funcionando de forma otimizada tanto em Node.js quanto
 * em navegadores. Ela converte a entrada fornecida para uma string Base64 e remove
 * os caracteres de preenchimento (`=`) no final, tornando-a mais compacta e segura para URLs.
 *
 * A implementação no navegador é robusta e lida corretamente com caracteres multi-byte (UTF-8),
 * como acentos e emojis.
 *
 * @param {string | Buffer | number} [text=""] - A entrada a ser codificada. Pode ser uma string,
 * Buffer (apenas Node.js) ou número.
 * @param {BufferEncoding} [fromFormat] - **(Apenas Node.js)** A codificação da string de entrada,
 * se não for UTF-8. Exemplos: 'utf-8', 'hex', 'binary'.
 *
 * @returns {string} A representação da string em Base64, sem o preenchimento (`=`).
 *
 * @example
 * // Uso no Navegador ou Node.js com string UTF-8
 * const encoded = base64To('Sucesso! ✓');
 * console.log(encoded); // "U3VjZXNzbyEg4pyT"
 */
function base64To(text = "", fromFormat) {
  // Garante que a função retorne uma string vazia para entradas nulas ou indefinidas.
  if (text == null) {
    return "";
  }

  try {
    let base64String;

    // **Ambiente Node.js:**
    if (typeof window === "undefined") {
      // Otimização: se a entrada já for um Buffer, usa-o diretamente.
      // Caso contrário, converte para string para garantir a consistência da entrada.
      const input = Buffer.isBuffer(text) ? text : String(text);
      
      // Utiliza a API nativa Buffer, que lida com diversos formatos de entrada (`fromFormat`).
      base64String = Buffer.from(input, fromFormat).toString("base64");
    } else {
      // **Ambiente do Navegador:**
      // A função `btoa` do navegador requer uma string onde cada caractere represente um byte (0-255).
      // Esta linha converte uma string UTF-8 padrão para este formato "binário", garantindo
      // que caracteres multi-byte (acentos, emojis) sejam codificados corretamente.
      const binaryString = unescape(encodeURIComponent(String(text)));
      base64String = window.btoa(binaryString);
    }

    // Remove um ou mais caracteres de preenchimento ('=') do final da string Base64
    // para criar uma saída mais compacta e segura para URLs.
    return base64String.replace(/=+$/, "");
  } catch (error) {
    // Em caso de qualquer erro durante o processo de codificação, retorna uma string vazia.
    return "";
  }
}

// ------------------------------------------------------------------------------------------------

module.exports = base64To;