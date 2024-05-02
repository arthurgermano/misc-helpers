const NF = require("node-forge");

// ------------------------------------------------------------------------------------------------

/**
 * @summary. Returns a text compressed
 * @param {String} message - The message to be encrypted
 * @param {String} publicKey - The public key to encrypt the message
 * @param {Integer} chunkSize - The maximum size of chunk - it is LIMITED because of RSA-OAEP - KEY SIZE!
 * @returns {Array} - The message encrypted in chunks
 */

function messageEncryptToChunks(message, publicKey, chunkSize = 200) {
  if (!message) return "";
  if (
    !publicKey ||
    !publicKey.includes("-----BEGIN PUBLIC KEY-----") ||
    !publicKey.includes("-----END PUBLIC KEY-----")
  ) {
    throw new Error("Public Key is not well PEM formatted");
  }
  if (chunkSize < 0 || !chunkSize) {
    chunkSize = 200;
  } else if (chunkSize > 214) {
    chunkSize = 214;
    console.warn(
      "MiscHelpers: NodeForge - Encription with public key the maximum chunk size is 214!"
    );
  }

  const chunks = [];
  const PK = NF.pki.publicKeyFromPem(publicKey);

  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(
      NF.util.encode64(
        PK.encrypt(message.substring(i, i + chunkSize), "RSA-OAEP")
      )
    );
  }

  return chunks.join(",");
}

// ------------------------------------------------------------------------------------------------

module.exports = messageEncryptToChunks;

// ------------------------------------------------------------------------------------------------
