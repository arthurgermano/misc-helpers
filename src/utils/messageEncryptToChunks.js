const NF = require("node-forge");
const base64To = require("./base64To");

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

  const chunks = [];
  const PK = NF.pki.publicKeyFromPem(publicKey);

  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(
      base64To(
        PK.encrypt(message.substring(i, i + chunkSize), "RSA-OAEP", {
          md: NF.md.sha256.create(),
        })
      )
    );
  }

  return chunks.join(",");
}

// ------------------------------------------------------------------------------------------------

module.exports = messageEncryptToChunks;

// ------------------------------------------------------------------------------------------------
