/**
 * Retrieves the appropriate cryptographic module for the current environment.
 *
 * This function checks whether the code is running in a browser or a Node.js environment
 * and returns the appropriate cryptographic module.
 *
 * @returns {Crypto|Object} The cryptographic module. In a browser, it returns the `window.crypto` object.
 *                          In a Node.js environment, it returns the `crypto` module.
 *
 * @throws {Error} If neither `window.crypto` nor the Node.js `crypto` module is available.
 *
 * @example
 * // Browser usage
 * const crypto = getCrypto();
 * console.log(crypto.subtle.digest);
 *
 * @example
 * // Node.js usage
 * const crypto = getCrypto();
 * const hash = crypto.createHash('sha256').update('hello').digest('hex');
 * console.log(hash);
 */
function getCrypto() {
  try {
    if (typeof window !== "undefined") {
      if (!window.crypto) {
        throw new Error(
          "window.crypto is not defined - Only works with HTTPS Protocol"
        );
      }
      return window.crypto;
    }
    return require("crypto");
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

module.exports = getCrypto;

// ------------------------------------------------------------------------------------------------
