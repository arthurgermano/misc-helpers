const { encrypt } = require("../crypto");
const base64To = require("../utils/base64To");

// ------------------------------------------------------------------------------------------------

/**
 * @summary Encripta uma mensagem em pedaços (chunks) usando RSA-OAEP.
 *
 * @description
 * Esta função assíncrona primeiro converte a mensagem para uma string Base64 para garantir
 * a consistência dos dados. Em seguida, divide essa string em pedaços e encripta cada
 * um em paralelo para máxima performance. O resultado é um array de strings, onde
 * cada uma representa um pedaço encriptado.
 *
 * @param {CryptoKey} publicKey - A chave pública RSA (formato `CryptoKey`) a ser usada.
 * @param {string} message - A mensagem de texto a ser encriptada.
 * @param {object} [props={}] - Propriedades adicionais para a encriptação.
 * @param {number} [props.chunkSize=190] - O tamanho de cada pedaço da string Base64.
 *
 * @returns {Promise<string[]>} Uma Promise que resolve para um array de pedaços encriptados.
 */
async function messageEncryptToChunks(publicKey, message, props = {}) {
  // 1. Converte a mensagem para Base64 PRIMEIRO.
  // Esta etapa é crucial para a consistência do sistema e o tratamento de caracteres especiais.
  const message64 = base64To(message);

  const chunkSize = props.chunkSize || 190;
  const chunks = [];

  // 2. Divide a string Base64 em pedaços (chunks).
  for (let i = 0; i < message64.length; i += chunkSize) {
    chunks.push(message64.substring(i, i + chunkSize));
  }

  // 3. Cria um array de Promises para encriptar cada pedaço da string Base64.
  const encryptionPromises = chunks.map(chunk => 
    encrypt(publicKey, chunk, props)
  );

  // 4. Executa todas as encriptações em paralelo para máxima performance.
  return Promise.all(encryptionPromises);
}

// ------------------------------------------------------------------------------------------------

module.exports = messageEncryptToChunks;