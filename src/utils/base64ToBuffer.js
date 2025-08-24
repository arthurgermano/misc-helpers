/**
 * @file Utilitário para decodificar Base64 para um ArrayBuffer.
 */

/**
 * @summary Converte uma string Base64 em um ArrayBuffer, compatível com ambos ambientes.
 *
 * @description
 * Esta função decodifica uma string Base64 para sua representação binária em um ArrayBuffer.
 * A implementação é cross-environment, garantindo um comportamento consistente e
 * retornando sempre um `ArrayBuffer` tanto no Node.js quanto em navegadores.
 *
 * @param {string} [base64String=""] - A string em formato Base64 a ser decodificada.
 *
 * @returns {ArrayBuffer} O `ArrayBuffer` decodificado. Retorna um `ArrayBuffer` vazio
 * (de 0 bytes) se a entrada for inválida, vazia ou se ocorrer um erro de decodificação.
 *
 * @example
 * const b64 = 'AAECAwQFBgcICQoLDA0ODw=='; // Bytes 0-15
 * const buffer = base64ToBuffer(b64);
 *
 * // `buffer` é sempre um ArrayBuffer.
 * const view = new Uint8Array(buffer);
 * console.log(view[10]); // 10
 */
function base64ToBuffer(base64String = "") {
  // Valida a entrada para garantir que é uma string.
  if (typeof base64String !== 'string' || base64String.length === 0) {
    // Retorna um ArrayBuffer vazio para entradas inválidas, conforme esperado pelos testes.
    return new ArrayBuffer(0);
  }

  try {
    // **Ambiente Node.js:**
    if (typeof window === 'undefined') {
      // Cria um Buffer do Node.js a partir da string Base64.
      const nodeBuffer = Buffer.from(base64String, 'base64');

      // Extrai o ArrayBuffer subjacente do Buffer do Node.js para manter a consistência do retorno.
      // O `slice` é crucial para garantir que obtenhamos a porção exata da memória
      // que corresponde a este buffer, já que o Node.js pode reutilizar pools de memória maiores.
      return nodeBuffer.buffer.slice(
        nodeBuffer.byteOffset,
        nodeBuffer.byteOffset + nodeBuffer.byteLength
      );
    }

    // **Ambiente do Navegador:**
    // Decodifica a string Base64 para uma "string binária".
    const binaryString = window.atob(base64String);
    const len = binaryString.length;

    // Cria um Uint8Array (uma visão de dados sobre um ArrayBuffer) com o tamanho necessário.
    const bytes = new Uint8Array(len);

    // Popula o array de bytes com os valores numéricos correspondentes a cada caractere.
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Retorna o `ArrayBuffer` subjacente, que contém os dados binários brutos.
    return bytes.buffer;

  } catch (error) {
    // Retorna um ArrayBuffer vazio em caso de erro
    return new ArrayBuffer(0);
  }
}

// ------------------------------------------------------------------------------------------------

export default base64ToBuffer;