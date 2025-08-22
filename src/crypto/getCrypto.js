/**
 * Retrieves the appropriate cryptographic module for the current environment.
 *
 * This function performs environment detection to determine whether the code is executing
 * in a browser or Node.js environment, then returns the corresponding cryptographic module.
 * The function prioritizes browser environments when `window` is available, falling back
 * to Node.js crypto module when running in server-side environments.
 *
 * @returns {Crypto|Object} The cryptographic module appropriate for the current environment:
 *                          - Browser: Returns `window.crypto` (Web Crypto API)
 *                          - Node.js: Returns the native `crypto` module
 *
 * @throws {Error} When cryptographic capabilities are unavailable:
 *                 - Browser: When `window.crypto` is undefined (typically HTTP contexts)
 *                 - Node.js: When the `crypto` module cannot be loaded
 *
 * @example
 * // Browser environment - Web Crypto API usage
 * const crypto = getCrypto();
 * const encoder = new TextEncoder();
 * const data = encoder.encode('hello world');
 * crypto.subtle.digest('SHA-256', data).then(hash => {
 *   console.log(new Uint8Array(hash));
 * });
 *
 * @example
 * // Node.js environment - crypto module usage
 * const crypto = getCrypto();
 * const hash = crypto.createHash('sha256')
 *   .update('hello world', 'utf8')
 *   .digest('hex');
 * console.log(hash);
 *
 * @example
 * // Universal usage pattern with error handling
 * try {
 *   const crypto = getCrypto();
 *   // Use crypto based on environment capabilities
 * } catch (error) {
 *   console.error('Cryptographic module unavailable:', error.message);
 * }
 */
function getCrypto() {
  // Check for browser environment by testing window object availability
  if (typeof window !== 'undefined') {
    // Validate that Web Crypto API is available in the browser context
    if (!window.crypto) {
      throw new Error(
        'window.crypto is not defined - Only works with HTTPS Protocol'
      );
    }
    
    // Return browser's Web Crypto API
    return window.crypto;
  }
  
  // Server-side environment detected - load Node.js crypto module
  // Using direct require since we're already in Node.js context
  return require('crypto');
}

// ------------------------------------------------------------------------------------------------

// Export for CommonJS compatibility (Node.js)
module.exports = getCrypto;