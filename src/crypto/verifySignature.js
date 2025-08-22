const getCrypto = require('./getCrypto');

// ------------------------------------------------------------------------------------------------

/**
 * Verifies digital signatures using the Web Crypto API in a cross-platform manner.
 *
 * This function provides a unified interface for cryptographic signature verification
 * across different environments (browser and Node.js). It leverages the Web Crypto API's
 * subtle.verify method to perform secure signature validation using various cryptographic
 * algorithms including RSA-PSS, RSA-PKCS1-v1_5, ECDSA, and HMAC.
 *
 * The verification process involves comparing a provided signature against the expected
 * signature for given data using the specified public key and algorithm. This is essential
 * for ensuring data integrity and authenticity in cryptographic workflows.
 *
 * @param {Object|string} algorithm - Algorithm specification for signature verification:
 *                          - Object: Detailed parameters (e.g., { name: 'RSA-PSS', saltLength: 32 })
 *                          - String: Simple algorithm name (e.g., 'RSA-PSS', 'ECDSA')
 *                          Common algorithms:
 *                          - RSA-PSS: RSA with PSS padding
 *                          - RSA-PKCS1-v1_5: RSA with PKCS#1 v1.5 padding
 *                          - ECDSA: Elliptic Curve Digital Signature Algorithm
 *                          - HMAC: Hash-based Message Authentication Code
 *
 * @param {CryptoKey} key - The cryptographic key used for signature verification:
 *                          - For asymmetric algorithms: Must be a public key with 'verify' usage
 *                          - For symmetric algorithms (HMAC): Can be the same key used for signing
 *                          - Must be compatible with the specified algorithm
 *                          - Key must have been imported with 'verify' in keyUsages array
 *
 * @param {BufferSource|ArrayBuffer|Uint8Array} signature - The digital signature to verify:
 *                          - Binary signature data as BufferSource (ArrayBuffer, Uint8Array, etc.)
 *                          - Must be in the format produced by the corresponding sign operation
 *                          - Length and format depend on the algorithm used:
 *                            - RSA signatures: typically 256 bytes (2048-bit) or 512 bytes (4096-bit)
 *                            - ECDSA signatures: varies by curve (64 bytes for P-256, 96 bytes for P-384)
 *                            - HMAC signatures: depends on hash function (32 bytes for SHA-256)
 *
 * @param {BufferSource|ArrayBuffer|Uint8Array} data - The original data that was signed:
 *                          - Binary data as BufferSource that needs to be verified against signature
 *                          - Must be exactly the same data used during the signing process
 *                          - Any modification to this data will cause verification to fail
 *                          - For text data, ensure consistent encoding (typically UTF-8)
 *
 * @returns {Promise<boolean>} Promise resolving to verification result:
 *                          - true: Signature is valid and data integrity is confirmed
 *                          - false: Signature is invalid, data may have been tampered with
 *                          Note: This method never rejects for invalid signatures, only for
 *                          operational errors (invalid keys, unsupported algorithms, etc.)
 *
 * @throws {Error} Throws an error when:
 *                 - Crypto module is unavailable in the current environment
 *                 - Invalid algorithm specification or unsupported algorithm
 *                 - Key is inappropriate for the algorithm or missing 'verify' usage
 *                 - Signature or data parameters are malformed or incompatible
 *                 - Environment doesn't support the specified cryptographic operations
 *
 * @example
 * // Verify RSA-PSS signature
 * const publicKey = await importCryptoKey(/* RSA public key parameters *);
 * const signatureBytes = new Uint8Array([...]); // RSA signature
 * const originalData = new TextEncoder().encode('Hello, World!');
 * 
 * const isValid = await verifySignature(
 *   {
 *     name: 'RSA-PSS',
 *     saltLength: 32
 *   },
 *   publicKey,
 *   signatureBytes,
 *   originalData
 * );
 * console.log('Signature valid:', isValid);
 *
 * @example
 * // Verify ECDSA signature with P-256 curve
 * const ecdsaKey = await importCryptoKey(/* ECDSA public key parameters *);
 * const ecdsaSignature = new Uint8Array([...]); // ECDSA signature (64 bytes for P-256)
 * const messageData = new Uint8Array([...]); // Original message
 * 
 * const result = await verifySignature(
 *   { name: 'ECDSA', hash: 'SHA-256' },
 *   ecdsaKey,
 *   ecdsaSignature,
 *   messageData
 * );
 *
 * @example
 * // Verify HMAC signature (symmetric)
 * const hmacKey = await importCryptoKey(/* HMAC key parameters *);
 * const hmacSignature = new Uint8Array(32); // HMAC-SHA256 signature
 * const payload = new TextEncoder().encode('{"user": "john", "action": "login"}');
 * 
 * try {
 *   const verified = await verifySignature(
 *     { name: 'HMAC', hash: 'SHA-256' },
 *     hmacKey,
 *     hmacSignature,
 *     payload
 *   );
 *   if (verified) {
 *     console.log('Message authenticated successfully');
 *   } else {
 *     console.warn('Message authentication failed - possible tampering');
 *   }
 * } catch (error) {
 *   console.error('Verification error:', error.message);
 * }
 */
async function verifySignature(algorithm, key, signature, data) {
  // Retrieve the appropriate crypto module for the current environment
  const crypto = getCrypto();
  
  // Perform signature verification using the Web Crypto API
  // The subtle.verify method handles the cryptographic verification process
  // and returns a boolean indicating signature validity
  return await crypto.subtle.verify(algorithm, key, signature, data);
}

// ------------------------------------------------------------------------------------------------

// Export for CommonJS compatibility (Node.js)
module.exports = verifySignature;