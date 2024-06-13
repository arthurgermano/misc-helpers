const getCrypto = require("./getCrypto");

// ------------------------------------------------------------------------------------------------
/**
 * Verifies a digital signature asynchronously using Web Crypto API in browser environment or Node.js crypto module.
 * @param {Object} algorithm - The algorithm object specifying the algorithm used for verification.
 * @param {CryptoKey} key - The public key or key pair used to verify the signature.
 * @param {BufferSource} signature - The digital signature to be verified.
 * @param {BufferSource} data - The data that was signed and needs to be verified against the signature.
 * @returns {Promise<boolean>} A Promise that resolves with a boolean indicating whether the signature is valid (true) or not (false).
 * @throws {Error} If there is an error during the verification process.
 */
async function verifySignature(algorithm, key, signature, data) {
  try {
    const crypto = getCrypto();
    return await crypto.subtle.verify(algorithm, key, signature, data);
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

module.exports = verifySignature;

// ------------------------------------------------------------------------------------------------
