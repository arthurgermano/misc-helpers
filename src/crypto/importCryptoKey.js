const getCrypto = require('./getCrypto.js');

// ------------------------------------------------------------------------------------------------

/**
 * Imports cryptographic keys using the Web Crypto API in a cross-platform manner.
 *
 * This function provides a unified interface for importing cryptographic keys across
 * different environments (browser and Node.js). It handles the environment-specific
 * crypto module retrieval and delegates the actual key import operation to the
 * appropriate Web Crypto API implementation.
 *
 * The function supports all standard key formats and algorithms supported by the
 * Web Crypto API, including RSA, ECDSA, ECDH, AES, and HMAC keys.
 *
 * @param {string} format - The data format of the key to import. Supported values:
 *                          - 'raw': Raw key data (typically for symmetric keys)
 *                          - 'spki': SubjectPublicKeyInfo format (for public keys)
 *                          - 'pkcs8': PKCS #8 format (for private keys)
 *                          - 'jwk': JSON Web Key format
 *
 * @param {BufferSource|ArrayBuffer|Uint8Array|Object} keyData - The key material to import:
 *                          - For 'raw', 'spki', 'pkcs8': BufferSource (ArrayBuffer, Uint8Array, etc.)
 *                          - For 'jwk': JavaScript object representing the JSON Web Key
 *
 * @param {Object|string} algorithm - Algorithm specification for the key:
 *                          - Object: Detailed algorithm parameters (e.g., { name: 'RSA-PSS', hash: 'SHA-256' })
 *                          - String: Simple algorithm name (e.g., 'AES-GCM', 'RSA-OAEP')
 *
 * @param {boolean} extractable - Key extractability flag:
 *                          - true: Key can be exported using crypto.subtle.exportKey()
 *                          - false: Key cannot be extracted (more secure for sensitive keys)
 *
 * @param {string[]} keyUsages - Array of permitted key operations:
 *                          - 'encrypt', 'decrypt': For encryption/decryption operations
 *                          - 'sign', 'verify': For digital signature operations
 *                          - 'deriveKey', 'deriveBits': For key derivation operations
 *                          - 'wrapKey', 'unwrapKey': For key wrapping operations
 *
 * @returns {Promise<CryptoKey>} Promise resolving to the imported CryptoKey object.
 *                          The CryptoKey can be used with other Web Crypto API methods
 *                          for cryptographic operations based on the specified keyUsages.
 *
 * @throws {Error} Throws an error if:
 *                 - The crypto module is unavailable in the current environment
 *                 - Invalid key format or algorithm specification
 *                 - Key data is malformed or incompatible with the specified format
 *                 - Requested key usages are incompatible with the algorithm
 *                 - Environment doesn't support the specified algorithm
 *
 * @example
 * // Import RSA public key from SPKI format
 * const publicKeyData = new Uint8Array([...]); // DER-encoded SPKI data
 * const publicKey = await importCryptoKey(
 *   'spki',
 *   publicKeyData,
 *   {
 *     name: 'RSA-OAEP',
 *     hash: 'SHA-256'
 *   },
 *   false,
 *   ['encrypt']
 * );
 *
 * @example
 * // Import AES symmetric key from raw bytes
 * const keyBytes = crypto.getRandomValues(new Uint8Array(32)); // 256-bit key
 * const aesKey = await importCryptoKey(
 *   'raw',
 *   keyBytes,
 *   { name: 'AES-GCM' },
 *   true,
 *   ['encrypt', 'decrypt']
 * );
 *
 * @example
 * // Import key from JSON Web Key format
 * const jwkData = {
 *   kty: 'RSA',
 *   use: 'sig',
 *   n: '...', // base64url-encoded modulus
 *   e: 'AQAB', // base64url-encoded exponent
 *   // ... other JWK properties
 * };
 * const rsaKey = await importCryptoKey(
 *   'jwk',
 *   jwkData,
 *   { name: 'RSA-PSS', hash: 'SHA-256' },
 *   false,
 *   ['verify']
 * );
 */
async function importCryptoKey(format, keyData, algorithm, extractable, keyUsages) {
  // Retrieve the appropriate crypto module for the current environment
  const crypto = getCrypto();
  
  // Delegate key import operation to the Web Crypto API
  // The subtle.importKey method handles the actual cryptographic key parsing and validation
  return await crypto.subtle.importKey(
    format,
    keyData,
    algorithm,
    extractable,
    keyUsages
  );
}

// ------------------------------------------------------------------------------------------------

// Export for CommonJS compatibility (Node.js)
module.exports = importCryptoKey;