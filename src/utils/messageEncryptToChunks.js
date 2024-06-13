const { encrypt } = require("../crypto");

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
    for (let i = 0; i < message.length; i += chunkSize) {
      chunks.push(
        await encrypt(publicKey, message.substring(i, i + chunkSize), props)
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
