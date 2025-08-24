import getCrypto from "./getCrypto.js";
import bufferFromString from "../utils/bufferFromString";
import base64FromBuffer from "../utils/base64FromBuffer.js";
import importCryptoKey from "./importCryptoKey.js";
import base64ToBuffer from "../utils/base64ToBuffer.js";

// ------------------------------------------------------------------------------------------------

/**
 * Encrypts a message using asymmetric cryptography with public key encryption.
 *
 * This function provides a complete encryption workflow that handles PEM-formatted
 * public keys, performs key importation, and encrypts plaintext messages using
 * industry-standard cryptographic algorithms. It supports various RSA encryption
 * schemes and is designed for secure data transmission scenarios where the sender
 * has access to the recipient's public key.
 *
 * The function automatically handles key format conversion from PEM to binary,
 * imports the key into the Web Crypto API, performs the encryption operation,
 * and returns the result as a base64-encoded string for easy transmission.
 *
 * @async
 * @param {string} publicKey - The public key in PEM format for encryption:
 *                            - Must be a valid PEM-encoded public key string
 *                            - Supports standard PEM headers (BEGIN/END PUBLIC KEY)
 *                            - Can include RSA-specific headers (BEGIN/END RSA PUBLIC KEY)
 *                            - Whitespace and line breaks are automatically handled
 *                            - Key should be compatible with the specified algorithm
 *
 * @param {string} message - The plaintext message to encrypt:
 *                          - UTF-8 encoded string that will be converted to binary
 *                          - Empty strings are handled gracefully (returns empty result)
 *                          - Message length is limited by the key size and padding:
 *                            - RSA-OAEP with 2048-bit key: ~190 bytes max
 *                            - RSA-OAEP with 4096-bit key: ~446 bytes max
 *                          - For larger messages, consider hybrid encryption approaches
 *
 * @param {Object} [props={}] - Configuration options for encryption parameters:
 * @param {string} [props.format='spki'] - Public key import format:
 *                            - 'spki': SubjectPublicKeyInfo format (most common for public keys)
 *                            - 'raw': Raw key data (not typical for RSA keys)
 *                            - 'jwk': JSON Web Key format
 *
 * @param {Object} [props.algorithm] - Cryptographic algorithm specification:
 *                            Default: { name: 'RSA-OAEP', hash: { name: 'SHA-256' } }
 *                            Supported algorithms:
 *                            - RSA-OAEP: Optimal Asymmetric Encryption Padding
 *                            - RSA-PKCS1-v1_5: PKCS#1 v1.5 padding (legacy, less secure)
 *                            Hash options: SHA-1, SHA-256, SHA-384, SHA-512
 *
 * @param {boolean} [props.extractable=true] - Key extractability setting:
 *                            - true: Key can be exported after import (default)
 *                            - false: Key cannot be extracted (more secure)
 *                            - Generally safe to leave as true for public keys
 *
 * @param {string[]} [props.keyUsages=['encrypt']] - Permitted key operations:
 *                            - ['encrypt']: Only encryption operations (default)
 *                            - ['encrypt', 'wrapKey']: Encryption and key wrapping
 *                            - Must include 'encrypt' for this function to work
 *
 * @param {string} [props.padding='RSA-OAEP'] - Encryption padding scheme:
 *                            - 'RSA-OAEP': Optimal Asymmetric Encryption Padding (recommended)
 *                            - 'RSA-PKCS1-v1_5': PKCS#1 v1.5 padding (legacy)
 *                            - Should match the algorithm.name parameter
 *
 * @returns {Promise<string>} Promise resolving to encrypted data:
 *                           - Base64-encoded string representation of encrypted bytes
 *                           - Ready for transmission over text-based protocols
 *                           - Can be stored safely in JSON, XML, or database text fields
 *                           - Returns empty string if input message is empty
 *
 * @throws {Error} Throws an error when:
 *                 - Public key is malformed or invalid PEM format
 *                 - Key is incompatible with the specified algorithm
 *                 - Message exceeds maximum size for the key/padding combination
 *                 - Cryptographic operation fails due to invalid parameters
 *                 - Required crypto modules are unavailable in the environment
 *
 * @example
 * // Basic RSA-OAEP encryption with default parameters
 * const publicKeyPem = `-----BEGIN PUBLIC KEY-----
 * MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...
 * -----END PUBLIC KEY-----`;
 *
 * const encrypted = await encrypt(publicKeyPem, 'Hello, World!');
 * console.log('Encrypted message:', encrypted);
 *
 * @example
 * // Advanced encryption with custom algorithm parameters
 * const customEncrypted = await encrypt(
 *   publicKeyPem,
 *   'Sensitive data',
 *   {
 *     algorithm: {
 *       name: 'RSA-OAEP',
 *       hash: { name: 'SHA-512' }
 *     },
 *     extractable: false,
 *     keyUsages: ['encrypt'],
 *     padding: 'RSA-OAEP'
 *   }
 * );
 *
 * @example
 * // Handle encryption errors gracefully
 * try {
 *   const result = await encrypt(publicKey, message);
 *   // Transmit or store the encrypted result
 *   await sendSecureMessage(result);
 * } catch (error) {
 *   console.error('Encryption failed:', error.message);
 *   // Implement fallback or error reporting
 * }
 *
 * @example
 * // Empty message handling
 * const emptyResult = await encrypt(publicKey, '');
 * console.log(emptyResult === ''); // true
 */
async function encrypt(publicKey, message, props = {}) {
  // Handle empty message case early for performance
  if (!message) return "";

  // Extract crypto module for the current environment
  const crypto = getCrypto();

  // Clean and convert PEM-formatted public key to binary format
  // Remove PEM headers, footers, and whitespace to get pure base64 content
  const cleanedPublicKey = publicKey.replace(
    /(-----(BEGIN|END) (RSA )?(PRIVATE|PUBLIC) KEY-----|\s)/g,
    ""
  );
  const binaryPublicKey = base64ToBuffer(cleanedPublicKey);

  // Import the public key into Web Crypto API format
  // Use provided parameters or sensible defaults for RSA-OAEP encryption
  const importedKey = await importCryptoKey(
    props.format || "spki",
    binaryPublicKey,
    props.algorithm || {
      name: "RSA-OAEP",
      hash: { name: "SHA-256" },
    },
    props.extractable !== undefined ? props.extractable : true,
    props.keyUsages || ["encrypt"]
  );

  // Convert message string to binary format for encryption
  const messageBuffer = bufferFromString(message);

  // Perform the actual encryption operation using the imported key
  // The padding parameter determines the encryption scheme used
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: props.padding || "RSA-OAEP" },
    importedKey,
    messageBuffer
  );

  // Convert encrypted binary data to base64 for safe text transmission
  return base64FromBuffer(encryptedBuffer);
}

// ------------------------------------------------------------------------------------------------

// Export for CommonJS compatibility (Node.js)
export default encrypt;
