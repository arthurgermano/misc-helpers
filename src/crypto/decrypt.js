const getCrypto = require("./getCrypto");
const bufferToString = require("../utils/bufferToString");
const base64ToBuffer = require("../utils/base64ToBuffer");
const base64From = require("../utils/base64From.js");
const importCryptoKey = require("./importCryptoKey.js");

// ------------------------------------------------------------------------------------------------

/**
 * Asynchronously decrypts an encrypted message using a provided private key.
 * 
 * @async
 * @function decrypt
 * @param {string} privateKey - The PEM-encoded private key to be used for decryption.
 * @param {string} encryptedMessage - The base64-encoded encrypted message to be decrypted.
 * @param {Object} [props={}] - Optional properties to configure the decryption process.
 * @param {string} [props.format="pkcs8"] - The format of the private key. Default is "pkcs8".
 * @param {Object} [props.algorithm={ name: "RSA-OAEP", hash: { name: "SHA-256" }}] - The algorithm to be used for decryption. Default is RSA-OAEP with SHA-256.
 * @param {boolean} [props.extractable=true] - Indicates whether the key can be extracted from the CryptoKey object. Default is true.
 * @param {Array} [props.keyUsages=["decrypt"]] - An array of key usages. Default is ["decrypt"].
 * @param {string} [props.padding="RSA-OAEP"] - The padding scheme to use for decryption. Default is "RSA-OAEP".
 * @returns {Promise<string>} - A promise that resolves to the decrypted message as a string.
 * @throws {Error} - Throws an error if decryption fails.
 * 
 */
async function decrypt(privateKey, encryptedMessage, props = {}) {
  try {
    if (!encryptedMessage) return "";
    const crypto = getCrypto();
    
    const binaryPrivateKey = base64From(
      privateKey.replace(/(-----(BEGIN|END) (RSA )?(PRIVATE|PUBLIC) KEY-----|\s)/g, ""),
      false
    );

    const importedKey = await importCryptoKey(
      props.format || "pkcs8",
      new Uint8Array(binaryPrivateKey),
      props.algorithm || {
        name: "RSA-OAEP",
        hash: { name: "SHA-256" },
      },
      props.extractable || true,
      props.keyUsages || ["decrypt"]
    );

    const data = base64ToBuffer(encryptedMessage);
    const decrypted = await crypto.subtle.decrypt(
      { name: props.padding || "RSA-OAEP" },
      importedKey,
      data
    );

    return bufferToString(decrypted);
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

module.exports = decrypt;

// ------------------------------------------------------------------------------------------------
