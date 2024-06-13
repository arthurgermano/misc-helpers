const getCrypto = require("./getCrypto");

// ------------------------------------------------------------------------------------------------
/**
 * Computes a cryptographic hash (digest) of the given data using the specified algorithm.
 *
 * @async
 * @function digest
 * @param {string} algorithm - The hash algorithm to use (e.g., 'SHA-256', 'SHA-1').
 * @param {string|Uint8Array} data - The data to hash, either as a string or a Uint8Array.
 * @returns {Promise<Uint8Array>} - A promise that resolves to the computed hash as a Uint8Array.
 * @throws {Error} - Throws an error if the hashing process fails.
 *
 * @example
 * // Hash a string using SHA-256
 * digest('SHA-256', 'hello world')
 *   .then(hash => {
 *     console.log(new Uint8Array(hash));
 *   })
 *   .catch(error => {
 *     console.error('Error hashing data:', error);
 *   });
 *
 * @example
 * // Hash a Uint8Array using SHA-1
 * const data = new Uint8Array([72, 101, 108, 108, 111]);
 * digest('SHA-1', data)
 *   .then(hash => {
 *     console.log(new Uint8Array(hash));
 *   })
 *   .catch(error => {
 *     console.error('Error hashing data:', error);
 *   });
 */
async function digest(algorithm, data) {
  try {
    let uint8array = data;
    if (typeof data === "string") {
      uint8array = Uint8Array.from(data.split("").map((x) => x.charCodeAt(0)));
    }

    const crypto = getCrypto();
    if (typeof window !== "undefined") {
      return await crypto.subtle.digest(algorithm, uint8array);
    }

    return crypto.createHash(algorithm).update(uint8array).digest();
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

module.exports = digest;

// ------------------------------------------------------------------------------------------------
