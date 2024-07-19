const { encrypt } = require("../crypto");
const base64To = require("../utils/base64To");

// ------------------------------------------------------------------------------------------------

/*
* Encrypts a message into chunks using RSA-OAEP encryption.
* @async
* @param {string} publicKey - The RSA public key in PEM format.
* @param {string} message - The message to encrypt.
* @param {Object} [props={}] - Additional encryption properties.
* @param {number} [props.chunkSize] - The size of each chunk (default: 214 bytes).
* @returns {Promise<string[]>} A Promise that resolves to an array of encrypted message chunks.
* @throws {Error} If encryption fails or any other error occurs.
*/
async function messageEncryptToChunks(publicKey, message, props = {}) {
  try {
    const chunks = [];
    const chunkSize = props.chunkSize || 190;
    const message64 = base64To(message);
    for (let i = 0; i < message64.length; i += chunkSize) {
      chunks.push(
        await encrypt(publicKey, message64.substring(i, i + chunkSize), props)
      );
    }
    return chunks;
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

module.exports = messageEncryptToChunks;

// ------------------------------------------------------------------------------------------------
