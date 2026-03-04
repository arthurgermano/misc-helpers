import { _injectedCrypto } from "./setCrypto.js";

/**
 * Retrieves the appropriate cryptographic module for the current environment.
 *
 * This function first checks whether an external module has been injected via
 * {@link setCrypto}. If so, it returns the injected module immediately, bypassing
 * all environment detection logic. This is the recommended approach for Node.js
 * ESM contexts where dynamic `require` is unavailable.
 *
 * When no injection is present, environment detection is performed automatically:
 * browser environments are identified by the presence of `window.crypto`, while
 * Node.js environments fall back to dynamic loading of the native `crypto` module.
 *
 * @returns {Crypto|Object} The cryptographic module appropriate for the current environment:
 *                          - Injected: Returns the module provided via {@link setCrypto}
 *                          - Browser:  Returns `window.crypto` (Web Crypto API)
 *                          - Node.js:  Returns the native `crypto` module
 *
 * @throws {Error} When cryptographic capabilities are unavailable:
 *                 - Browser: When `window.crypto` is undefined (typically HTTP contexts)
 *                 - Node.js: When the `crypto` module cannot be loaded and no
 *                            injection has been provided via {@link setCrypto}
 *
 * @example
 * // Recommended — Node.js ESM, inject before calling getCrypto
 * import crypto from "crypto";
 * import { setCrypto } from "./setCrypto.js";
 * import getCrypto from "./getCrypto.js";
 *
 * setCrypto(crypto);
 * const cryptoModule = getCrypto(); // returns the injected module
 *
 * @example
 * // Browser environment — Web Crypto API usage
 * const crypto = getCrypto();
 * const encoder = new TextEncoder();
 * const data = encoder.encode('hello world');
 * crypto.subtle.digest('SHA-256', data).then(hash => {
 *   console.log(new Uint8Array(hash));
 * });
 *
 * @example
 * // Node.js environment without injection — dynamic require fallback
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
  // Injected module takes precedence — bypasses all detection logic.
  // Use setCrypto() before any call in ESM environments where require is unavailable.
  if (_injectedCrypto !== null) {
    return _injectedCrypto;
  }

  // Check for browser environment by testing window object availability
  if (typeof window !== "undefined" && typeof window.crypto !== "undefined") {
    // Return browser's Web Crypto API
    return window.crypto;
  }

  // Server-side environment detected — try all available methods to load
  // the Node.js crypto module for maximum compatibility across CJS, ESM and bundlers
  try {
    // Method 1: CommonJS or bundler environment — require is available globally
    if (typeof require !== "undefined") {
      return require("crypto");
    }

    // Method 2: ESM in Node.js with createRequire — manually construct require
    if (typeof module !== "undefined" && module.createRequire) {
      const require = module.createRequire(import.meta.url);
      return require("crypto");
    }

    // Method 3: All dynamic methods failed — ESM pure environment with no require.
    // Caller must inject the module explicitly via setCrypto() before any call.
    throw new Error(
      "No method available to load crypto module in current environment — " +
      "call setCrypto(crypto) before using this module in ESM environments",
    );
  } catch (error) {
    throw new Error(`Failed to load crypto module: ${error.message}`);
  }
}

// ------------------------------------------------------------------------------------------------
// Export for ESM
export default getCrypto;
