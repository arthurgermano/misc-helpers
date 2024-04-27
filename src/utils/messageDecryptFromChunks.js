const NF = require("node-forge");
const base64From = require("./base64From");

// ------------------------------------------------------------------------------------------------

/**
 * @summary. Returns a text compressed
 * @param {String} message - The message to be encrypted
 * @param {String} privateKey - The public key to encrypt the message
 * @returns {Array} - The message encrypted in chunks
 */

function messageDecryptFromChunks(messageChunks, privateKey) {
  if (
    !messageChunks ||
    !Array.isArray(messageChunks) ||
    messageChunks.length == 0
  )
    return "";
  if (
    !privateKey ||
    !privateKey.includes("-----BEGIN PRIVATE KEY-----") ||
    !privateKey.includes("-----END PRIVATE KEY-----")
  ) {
    throw new Error("Private Key is not well PEM formatted");
  }

  const PK = NF.pki.privateKeyFromPem(privateKey);
  const chunks = [];
  const message = [];
  for (let chunk of messageChunks) {
    message.push(
      PK.decrypt(base64From(chunk), "RSA-OAEP")
    );
  }

  return message.join("");
}

// ------------------------------------------------------------------------------------------------

module.exports = messageDecryptFromChunks;

// ------------------------------------------------------------------------------------------------
