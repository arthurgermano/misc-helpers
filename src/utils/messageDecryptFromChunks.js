const { decrypt } = require("../crypto");

// ------------------------------------------------------------------------------------------------

/**
 * Decrypts a message from encrypted chunks using RSA-OAEP decryption.
 * @async
 * @param {string} privateKey - The RSA private key in PEM format.
 * @param {string[]} messageChunks - An array of encrypted message chunks.
 * @param {Object} [props={}] - Additional decryption properties.
 * @returns {Promise<string>} A Promise that resolves to the decrypted message.
 * @throws {Error} If decryption fails or any other error occurs.
 */
async function messageDecryptFromChunks(privateKey, messageChunks, props = {}) {
  try {
    const message = [];
    for (let chunk of messageChunks) {
      message.push(await decrypt(privateKey, chunk, props));
    }

    return message.join("");
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

module.exports = messageDecryptFromChunks;

// ------------------------------------------------------------------------------------------------
