const getCrypto = require("./getCrypto");
const bufferToString = require("../utils/bufferToString");
const base64ToBuffer = require("../utils/base64ToBuffer");

// ------------------------------------------------------------------------------------------------

/**
 * Decrypts an encrypted message using RSA-OAEP decryption.
 * @async
 * @param {string} privateKey - The RSA private key in PEM format.
 * @param {string} encryptedMessage - The encrypted message to decrypt in Base64 encoding.
 * @param {Object} [props={}] - Additional decryption properties.
 * @param {number} [props.padding] - The padding scheme to use (default: RSA_PKCS1_OAEP_PADDING).
 * @param {string} [props.oaepHash] - The hash algorithm to use with OAEP padding (default: "sha256").
 * @returns {Promise<string>} A Promise that resolves to the decrypted message.
 * @throws {Error} If the encrypted message is empty or the private key is not well-formatted.
 */
async function decrypt(privateKey, encryptedMessage, props = {}) {
  try {
    if (!encryptedMessage) return "";
    if (
      !privateKey ||
      !privateKey.includes("-----BEGIN PRIVATE KEY-----") ||
      !privateKey.includes("-----END PRIVATE KEY-----")
    ) {
      throw new Error("Private Key is not well PEM formatted");
    }
    const crypto = getCrypto();
    const data = base64ToBuffer(encryptedMessage);
    
    let decrypted;
    if (typeof window !== "undefined") {
      decrypted = await crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        privateKey,
        data
      );
    } else {
      decrypted = crypto.privateDecrypt(
        {
          key: privateKey,
          padding: props.padding || crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: props.oaepHash || "sha256",
        },
        data
      );
    }

    return bufferToString(decrypted);
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

module.exports = decrypt;

// ------------------------------------------------------------------------------------------------
