import encryptBuffer from "../crypto/encryptBuffer";
import bufferFromString from "../utils/bufferFromString";

// ------------------------------------------------------------------------------------------------

/**
 * @summary Encripta uma mensagem em pedaços (chunks) usando RSA-OAEP.
 *
 * @description
 * Esta função assíncrona primeiro converte o payload para um buffer de bytes.
 * Em seguida, divide esse buffer em pedaços (chunks) e encripta cada um deles
 * em paralelo para máxima performance. O resultado é um array de strings, onde
 * cada uma representa um pedaço encriptado em base64.
 *
 * @param {string} publicKey - A chave pública RSA (formato string PEM) a ser usada.
 * @param {object} payload - A carga a ser encriptada.
 * @param {object} [props={}] - Propriedades adicionais para a encriptação.
 * @param {number} [props.chunkSize=190] - O tamanho máximo de cada pedaço em bytes.
 * O padrão 190 é o limite seguro para chaves RSA de 2048 bits com padding OAEP.
 *
 * @returns {Promise<string[]>} Uma Promise que resolve para um array de pedaços encriptados.
 */
async function messageEncryptToChunks(publicKey, payload, props = {}) {
  if (payload === undefined || payload === null) {
    return []; // Retornar um array vazio é mais consistente com o tipo de retorno
  }
  let { chunkSize } = props || {};
  if (!isFinite(chunkSize) || chunkSize <= 0) {
    chunkSize = 190;
  }

  const jsonPayload = JSON.stringify({ data: payload });
  const bufferPayload = bufferFromString(jsonPayload);
  const chunks = [];

  // 1. Divide o buffer principal em vários buffers menores (chunks).
  for (let i = 0; i < bufferPayload.length; i += chunkSize) {
    chunks.push(bufferPayload.slice(i, i + chunkSize));
  }

  // 2. Mapeia cada chunk de buffer para uma promessa de encriptação.
  const encryptionPromises = chunks.map((chunk) => {
    return encryptBuffer(publicKey, chunk, props);
  });

  // 3. Executa todas as encriptações em paralelo para máxima performance.
  return Promise.all(encryptionPromises);
}

// ------------------------------------------------------------------------------------------------

export default messageEncryptToChunks;
