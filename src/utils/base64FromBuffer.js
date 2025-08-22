const base64To = require("./base64To");

// ------------------------------------------------------------------------------------------------

/**
 * @file Utilitário para conversão de ArrayBuffer para Base64.
 * @author Seu Nome <seu.email@example.com>
 * @version 2.0.0
 */

/**
 * @summary Converte um ArrayBuffer em uma string Base64.
 *
 * @description
 * Esta função é cross-environment, funcionando de forma otimizada tanto em Node.js quanto
 * em navegadores. Ela lida com a conversão de dados binários brutos de um ArrayBuffer
 * para sua representação textual em Base64.
 *
 * No navegador, a função processa o buffer em blocos (chunks) para evitar erros de
 * "Maximum call stack size exceeded", garantindo a conversão segura de buffers grandes.
 *
 * @param {ArrayBuffer} buffer - O ArrayBuffer a ser convertido.
 *
 * @returns {string} A representação da string em Base64. Retorna uma string vazia
 * se a entrada não for um ArrayBuffer válido.
 *
 * @example
 * const data = new Uint8Array([0, 1, 2, 3, 253, 254, 255]);
 * const base64String = base64FromBuffer(data.buffer);
 * console.log(base64String); // "AAECA/3+/w=="
 */
function base64FromBuffer(buffer) {
  // Adiciona validação para garantir que a entrada é do tipo esperado.
  if (!(buffer instanceof ArrayBuffer)) {
    return "";
  }

  // **Ambiente Node.js:**
  // A verificação `typeof window` é a forma padrão de diferenciar os ambientes.
  if (typeof window === "undefined") {
    // A forma mais eficiente no Node: converte o ArrayBuffer para um Buffer nativo
    // e delega para a função de encoding, que é otimizada para isso.
    return base64To(Buffer.from(buffer));
  }

  // **Ambiente do Navegador (implementação robusta):**
  const bytes = new Uint8Array(buffer);
  const CHUNK_SIZE = 8192; // Define um tamanho de bloco seguro (8KB)
  const chunks = [];

  // Itera sobre o buffer em blocos para evitar estouro de pilha.
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    // Pega um "pedaço" do buffer. `subarray` é eficiente pois não cria uma nova cópia dos dados.
    const chunk = bytes.subarray(i, i + CHUNK_SIZE);

    // Converte o bloco de bytes em uma string binária e a armazena.
    // Usar um array e `join` no final é geralmente mais performático que concatenação com `+=`.
    chunks.push(String.fromCharCode.apply(null, chunk));
  }

  // Junta os blocos de string em um só e passa para a função de encoding (que usará btoa).
  return base64To(chunks.join(""));
}

// ------------------------------------------------------------------------------------------------

module.exports = base64FromBuffer;