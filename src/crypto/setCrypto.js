// ------------------------------------------------------------------------------------------------
// Internal state — holds the injected crypto module when set externally.
// Initialized as null to indicate no override has been provided.
let _injectedCrypto = null;

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
 *
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
// Export for ESM
export default setCrypto;
export { _injectedCrypto };
