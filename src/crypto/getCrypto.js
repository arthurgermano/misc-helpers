// ------------------------------------------------------------------------------------------------
// Internal state — holds the injected crypto module when set externally.
// Initialized as null to indicate no override has been provided.
// Shared exclusively within this module — never exported directly.
let _injectedCrypto = null;

// ------------------------------------------------------------------------------------------------

/**
 * Injects an external cryptographic module to override the automatic environment
 * detection performed by {@link getCrypto}.
 *
 * This function is intended for environments where dynamic module loading is
 * unavailable or unreliable — such as ESM contexts in Node.js where `require`
 * is not defined. By injecting the native `crypto` module explicitly, the caller
 * bypasses the internal detection logic entirely.
 *
 * Once set, any subsequent call to {@link getCrypto} will return the injected
 * module instead of performing environment detection.
 *
 * Pass `null` to clear the injection and restore automatic detection behavior.
 *
 * @param {Crypto|Object|null} cryptoModule - The cryptographic module to inject.
 *                                            Must expose the same interface expected
 *                                            by the consuming functions (e.g. createHash,
 *                                            publicEncrypt, privateDecrypt for Node.js,
 *                                            or subtle for browser Web Crypto API).
 *                                            Pass `null` to reset to automatic detection.
 * @returns {void}
 *
 * @throws {Error} When the provided value is neither a non-null object nor null —
 *                 prevents silent failures from invalid injections such as strings
 *                 or numeric values.
 *
 * @example
 * // Node.js ESM — inject native crypto to avoid dynamic require issues
 * import crypto from "crypto";
 * import { setCrypto } from "misc-helpers";
 *
 * setCrypto(crypto);
 *
 * @example
 * // Browser — inject Web Crypto API explicitly
 * import { setCrypto } from "misc-helpers";
 *
 * setCrypto(window.crypto);
 *
 * @example
 * // Reset to automatic detection
 * import { setCrypto } from "misc-helpers";
 *
 * setCrypto(null);
 */
function setCrypto(cryptoModule) {
  if (cryptoModule !== null && typeof cryptoModule !== "object") {
    throw new Error(
      `setCrypto: expected a crypto module object or null, received ${typeof cryptoModule}`,
    );
  }

  _injectedCrypto = cryptoModule;
}

// ------------------------------------------------------------------------------------------------

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
 * Node.js environments fall back to dynamic loading of the native `crypto` module
 * through multiple compatibility strategies.
 *
 * @returns {Crypto|Object} The cryptographic module appropriate for the current environment:
 *                          - Injected: Returns the module provided via {@link setCrypto}
 *                          - Browser:  Returns `window.crypto` (Web Crypto API)
 *                          - Node.js:  Returns the native `crypto` module
 *
 * @throws {Error} When cryptographic capabilities are unavailable:
 *                 - Browser: When `window.crypto` is undefined (typically HTTP contexts)
 *                 - Node.js: When all loading strategies fail and no injection has been
 *                            provided via {@link setCrypto}
 *
 * @example
 * // Recommended — Node.js ESM, inject before calling getCrypto
 * import crypto from "crypto";
 * import { setCrypto, getCrypto } from "misc-helpers";
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
export { getCrypto, setCrypto };
export default getCrypto;
