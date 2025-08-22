const { decrypt } = require("../crypto");
const base64From = require("../utils/base64From");

// ------------------------------------------------------------------------------------------------

/**
 * @summary Decripta uma mensagem a partir de pedaços (chunks) encriptados.
 *
 * @description
 * Esta função assíncrona recebe um array de pedaços encriptados, decripta cada um
 * deles em paralelo para máxima performance, e então une os resultados (que são pedaços
 * de uma string Base64) para reconstruir e decodificar a mensagem de texto original.
 *
 * @param {CryptoKey} privateKey - A chave privada RSA (formato `CryptoKey`) a ser usada.
 * @param {string[]} messageChunks - Um array de strings, onde cada uma é um pedaço encriptado.
 * @param {object} [props={}] - Propriedades adicionais para a decriptação.
 *
 * @returns {Promise<string>} Uma Promise que resolve para a mensagem original decriptada.
 */
async function messageDecryptFromChunks(privateKey, messageChunks, props = {}) {
  // 1. Cria um array de Promises, onde cada uma representa a decriptação de um pedaço.
  const decryptionPromises = messageChunks.map(chunk =>
    decrypt(privateKey, chunk, props)
  );

  // 2. Executa todas as decriptações em paralelo. O resultado é um array de pedaços de string Base64.
  const decryptedChunks = await Promise.all(decryptionPromises);

  // 3. Junta os pedaços de Base64 em uma única string.
  const finalBase64 = decryptedChunks.join("");

  // 4. Decodifica a string Base64 final de volta para o texto original.
  return base64From(finalBase64);
}

// ------------------------------------------------------------------------------------------------

module.exports = messageDecryptFromChunks;