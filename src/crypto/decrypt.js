import getCrypto from "./getCrypto";
import bufferToString from "../utils/bufferToString";
import base64ToBuffer from "../utils/base64ToBuffer";
import importCryptoKey from "./importCryptoKey.js";

// ------------------------------------------------------------------------------------------------

/**
 * Asynchronously decrypts an encrypted message using a provided private key.
 * 
 * This function performs RSA-OAEP decryption using the Web Crypto API, supporting both
 * Node.js and browser environments. It handles PEM-formatted private keys and base64-encoded
 * encrypted messages, providing a secure and efficient decryption process.
 *
 * @async
 * @function decrypt
 * @param {string} privateKey - The PEM-encoded private key used for decryption
 * @param {string} encryptedMessage - The base64-encoded encrypted message to decrypt
 * @param {Object} [props={}] - Configuration options for the decryption process
 * @param {string} [props.format="pkcs8"] - Private key format specification
 * @param {Object} [props.algorithm] - Cryptographic algorithm configuration
 * @param {string} [props.algorithm.name="RSA-OAEP"] - Algorithm name
 * @param {Object} [props.algorithm.hash] - Hash algorithm configuration
 * @param {string} [props.algorithm.hash.name="SHA-256"] - Hash algorithm name
 * @param {boolean} [props.extractable=true] - Whether the imported key can be extracted
 * @param {string[]} [props.keyUsages=["decrypt"]] - Permitted key usage operations
 * @param {string} [props.padding="RSA-OAEP"] - Padding scheme for decryption operation
 * @returns {Promise<string>} The decrypted message as a UTF-8 string
 * @throws {Error} When decryption fails due to invalid key, corrupted data, or crypto errors
 * 
 * @example
 * const decryptedText = await decrypt(pemPrivateKey, base64EncryptedMessage);
 * 
 * @example
 * const decryptedText = await decrypt(pemPrivateKey, base64EncryptedMessage, {
 *   algorithm: { name: "RSA-OAEP", hash: { name: "SHA-1" } },
 *   extractable: false
 * });
 */
async function decrypt(privateKey, encryptedMessage, props = {}) {
  // Early return for empty encrypted messages to avoid unnecessary processing
  if (!encryptedMessage) {
    return "";
  }

  // Destructure configuration with optimized defaults
  const {
    format = "pkcs8",
    algorithm = { name: "RSA-OAEP", hash: { name: "SHA-256" } },
    extractable = true,
    keyUsages = ["decrypt"],
    padding = "RSA-OAEP"
  } = props;

  // Get crypto implementation (Node.js or browser)
  const crypto = getCrypto();

  // Clean and convert PEM private key to binary format
  // Removes PEM headers, footers, and whitespace in a single operation
  const cleanedPrivateKey = privateKey.replace(
    /-----(BEGIN|END) (?:RSA )?(?:PRIVATE|PUBLIC) KEY-----|\s/g,
    ""
  );
  const binaryPrivateKey = base64ToBuffer(cleanedPrivateKey);

  // Import the private key for cryptographic operations
  const importedKey = await importCryptoKey(
    format,
    binaryPrivateKey,
    algorithm,
    extractable,
    keyUsages
  );

  // Convert base64 encrypted message to binary data
  const encryptedData = base64ToBuffer(encryptedMessage);

  // Perform decryption using the Web Crypto API
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: padding },
    importedKey,
    encryptedData
  );

  // Convert decrypted binary data back to string
  return bufferToString(decryptedBuffer);
}

// ------------------------------------------------------------------------------------------------

export default decrypt;

// ------------------------------------------------------------------------------------------------