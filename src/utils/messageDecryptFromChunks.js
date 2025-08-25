import decryptBuffer from "../crypto/decryptBuffer";
import bufferToString from "../utils/bufferToString";

// ------------------------------------------------------------------------------------------------

/**
 * @summary Decripta uma mensagem a partir de pedaços (chunks) encriptados.
 *
 * @description
 * Esta função assíncrona recebe um array de pedaços encriptados, decripta cada um
 * deles em paralelo para máxima performance, e então concatena os buffers resultantes
 * para reconstruir a mensagem original.
 *
 * @param {string} privateKey - A chave privada RSA (formato string PEM) a ser usada.
 * @param {string[]} messageChunks - Um array de strings, onde cada uma é um pedaço encriptado.
 * @param {object} [props={}] - Propriedades adicionais para a decriptação.
 *
 * @returns {Promise<any>} Uma Promise que resolve para o payload original decriptado.
 */
async function messageDecryptFromChunks(privateKey, messageChunks, props = {}) {
  if (!messageChunks || messageChunks.length === 0) {
    return "";
  }

  const decryptionPromises = messageChunks.map(chunk =>
    decryptBuffer(privateKey, chunk, props)
  );
  const decryptedBuffers = await Promise.all(decryptionPromises);

  
  // Lógica de concatenação de alta performance.
  // Etapa A: Calcula o tamanho total necessário para o buffer final.
  let totalLength = 0;
  for (const buffer of decryptedBuffers) {
    totalLength += buffer.byteLength;
  }

  // Etapa B: Aloca um único buffer grande (Uint8Array) de uma só vez.
  const finalBuffer = new Uint8Array(totalLength);

  // Etapa C: Copia cada buffer decriptado para a sua posição correta no buffer final.
  let offset = 0;
  for (const buffer of decryptedBuffers) {
    finalBuffer.set(new Uint8Array(buffer), offset);
    offset += buffer.byteLength;
  }

  const jsonString = bufferToString(finalBuffer);
  
  const payload = JSON.parse(jsonString);

  return payload.data;
}

// ------------------------------------------------------------------------------------------------

export default messageDecryptFromChunks;