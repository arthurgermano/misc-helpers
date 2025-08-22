/**
 * @file Utilitário para converter um buffer de bytes para uma string.
 * @author Seu Nome <seu.email@example.com>
 * @version 2.0.0
 */

/**
 * @summary Converte um buffer de bytes (`ArrayBuffer`, `Buffer`, etc.) para uma string.
 *
 * @description
 * Esta função converte dados binários para sua representação como string de texto.
 * A função é universalmente compatível, usando o método `toString()` do `Buffer` no Node.js
 * e a API `TextDecoder` no navegador.
 *
 * @param {ArrayBuffer | Buffer | Uint8Array} buffer - O buffer a ser convertido para string.
 * @param {BufferEncoding} [encoding="utf-8"] - **(Apenas Node.js)** A codificação a ser usada
 * para interpretar os bytes. Exemplos: 'utf-8', 'hex', 'base64', 'latin1'.
 * **No ambiente do navegador, este parâmetro é ignorado e a decodificação será sempre UTF-8**,
 * devido a limitações da API `TextDecoder`.
 *
 * @returns {string} A string resultante da decodificação do buffer. Retorna uma string vazia
 * se a entrada for inválida ou vazia.
 *
 * @example
 * // Criando um buffer a partir de uma string (exemplo)
 * const myBuffer = new TextEncoder().encode('Olá, Mundo! 👋');
 *
 * const text = bufferToString(myBuffer);
 * console.log(text); // "Olá, Mundo! 👋"
 *
 * // Exemplo específico do Node.js com 'hex'
 * // const hexBuffer = Buffer.from('4f6c612c204d756e646f2120f09f918b', 'hex');
 * // const textFromHex = bufferToString(hexBuffer, 'utf-8'); // "Olá, Mundo! 👋"
 */
function bufferToString(buffer, encoding = "utf-8") {
  // 1. Validação da entrada: retorna string vazia para entradas nulas ou indefinidas.
  if (buffer == null) {
    return "";
  }

  // **Ambiente Node.js:**
  if (typeof window === 'undefined') {
    // Garante que estamos trabalhando com um Buffer do Node.js para usar seu método `toString`.
    const nodeBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
    // Usa o método nativo do Buffer, que é otimizado e suporta múltiplos encodings.
    return nodeBuffer.toString(encoding);
  }

  // **Ambiente do Navegador:**
  try {
    // `TextDecoder` é a API padrão da web para converter bytes em string.
    // Ela sempre decodifica como UTF-8, ignorando o parâmetro `encoding`.
    return new TextDecoder().decode(buffer);
  } catch (error) {
    // Retorna uma string vazia se o buffer de entrada for inválido para a API.
    return "";
  }
}

// ------------------------------------------------------------------------------------------------

module.exports = bufferToString;