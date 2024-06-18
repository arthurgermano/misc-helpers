const getCrypto = require("./getCrypto.js");

// ------------------------------------------------------------------------------------------------
/**
 * Imports a public key asynchronously using Web Crypto API in browser environment or Node.js crypto module.
 * @param {string} format - The format of the key data ('spki', 'pkcs8', etc.).
 * @param {BufferSource | CryptoKey | ArrayBuffer} keyData - The key data to import.
 * @param {Object} algorithm - The algorithm object specifying the algorithm used by the key.
 * @param {boolean} extractable - Indicates if the key can be extracted from the CryptoKey object.
 * @param {string[]} keyUsages - Array of key usage identifiers ('encrypt', 'decrypt', 'verify', etc.).
 * @returns {Promise<CryptoKey>} A Promise that resolves with the imported CryptoKey object.
 * @throws {Error} If there is an error during key import process.
 */
async function importCryptoKey(
  format,
  keyData,
  algorithm,
  extractable,
  keyUsages
) {
  try {
    const crypto = getCrypto();
    return await crypto.subtle.importKey(
      format,
      keyData,
      algorithm,
      extractable,
      keyUsages
    );
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

module.exports = importCryptoKey;

// ------------------------------------------------------------------------------------------------
