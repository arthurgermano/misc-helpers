const getCrypto = require("./getCrypto.js");
const bufferFromString = require("../utils/bufferFromString");
const base64FromBuffer = require("../utils/base64FromBuffer.js");

// ------------------------------------------------------------------------------------------------

/**
 * Encrypts a message using RSA-OAEP encryption.
 * @async
 * @param {string} publicKey - The RSA public key in PEM format.
 * @param {string} message - The message to encrypt.
 * @param {Object} [props={}] - Additional encryption properties.
 * @param {number} [props.padding] - The padding scheme to use (default: RSA_PKCS1_OAEP_PADDING).
 * @param {string} [props.oaepHash] - The hash algorithm to use with OAEP padding (default: "sha256").
 * @returns {Promise<string>} A Promise that resolves to the encrypted message in Base64 encoding.
 * @throws {Error} If the message is empty or the public key is not well-formatted.
 */
async function encrypt(publicKey, message, props = {}) {
  try {
    if (!message) return "";
    if (
      !publicKey ||
      !publicKey.includes("-----BEGIN PUBLIC KEY-----") ||
      !publicKey.includes("-----END PUBLIC KEY-----")
    ) {
      throw new Error("Public Key is not well PEM formatted");
    }
    
    const crypto = getCrypto();
    const data = bufferFromString(message);

    let encrypted;
    if (typeof window !== "undefined") {
      encrypted = await crypto.subtle.encrypt(
        { name: props.padding || "RSA-OAEP" },
        publicKey,
        data
      );
    } else {
      encrypted = crypto.publicEncrypt(
        {
          key: publicKey,
          padding: props.padding || crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: props.oaepHash || "sha256",
        },
        data
      );
    }

    return base64FromBuffer(encrypted);
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

module.exports = encrypt;

// ------------------------------------------------------------------------------------------------
