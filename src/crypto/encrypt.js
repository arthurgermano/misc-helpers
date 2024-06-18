const getCrypto = require("./getCrypto.js");
const bufferFromString = require("../utils/bufferFromString");
const base64FromBuffer = require("../utils/base64FromBuffer.js");
const importCryptoKey = require("./importCryptoKey.js");
const base64From = require("../utils/base64From.js");

// ------------------------------------------------------------------------------------------------

/**
 * Asynchronously encrypts a message using a provided public key.
 * 
 * @async
 * @function encrypt
 * @param {string} publicKey - The PEM-encoded public key to be used for encryption.
 * @param {string} message - The message to be encrypted.
 * @param {Object} [props={}] - Optional properties to configure the encryption process.
 * @param {string} [props.format="spki"] - The format of the public key. Default is "spki".
 * @param {Object} [props.algorithm={ name: "RSA-OAEP", hash: { name: "SHA-256" }}] - The algorithm to be used for encryption. Default is RSA-OAEP with SHA-256.
 * @param {boolean} [props.extractable=true] - Indicates whether the key can be extracted from the CryptoKey object. Default is true.
 * @param {Array} [props.keyUsages=["encrypt"]] - An array of key usages. Default is ["encrypt"].
 * @param {string} [props.padding="RSA-OAEP"] - The padding scheme to use for encryption. Default is "RSA-OAEP".
 * @returns {Promise<string>} - A promise that resolves to the encrypted message as a base64 string.
 * @throws {Error} - Throws an error if encryption fails.
 * 
 */
async function encrypt(publicKey, message, props = {}) {
  try {
    if (!message) return "";

    const crypto = getCrypto();
    const binaryPublicKey = base64From(
      publicKey.replace(
        /(-----(BEGIN|END) (RSA )?(PRIVATE|PUBLIC) KEY-----|\s)/g,
        ""
      ),
      false
    );

    const importedKey = await importCryptoKey(
      props.format || "spki",
      new Uint8Array(binaryPublicKey),
      props.algorithm || {
        name: "RSA-OAEP",
        hash: { name: "SHA-256" },
      },
      props.extractable || true,
      props.keyUsages || ["encrypt"]
    );

    const data = bufferFromString(message);
    const encrypted = await crypto.subtle.encrypt(
      { name: props.padding || "RSA-OAEP" },
      importedKey,
      data
    );

    return base64FromBuffer(encrypted);
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

module.exports = encrypt;

// ------------------------------------------------------------------------------------------------
