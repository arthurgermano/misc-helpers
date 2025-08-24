import getCrypto from "./getCrypto";

// ------------------------------------------------------------------------------------------------

/**
 * Computes a cryptographic hash (digest) of the given data using the specified algorithm.
 * 
 * This function provides a unified interface for cryptographic hashing that works seamlessly
 * across both Node.js and browser environments. It automatically handles string-to-binary
 * conversion and selects the appropriate hashing implementation based on the runtime environment.
 *
 * @async
 * @function digest
 * @param {string} algorithm - The hash algorithm identifier (e.g., 'SHA-256', 'SHA-1', 'SHA-512')
 * @param {string|Uint8Array} data - The input data to hash - string or binary array
 * @returns {Promise<Uint8Array>} The computed cryptographic hash as a Uint8Array
 * @throws {Error} When the algorithm is unsupported or hashing operation fails
 *
 * @example
 * // Hash a string using SHA-256
 * const hash = await digest('SHA-256', 'hello world');
 * console.log(Array.from(hash).map(b => b.toString(16).padStart(2, '0')).join(''));
 *
 * @example
 * // Hash binary data using SHA-1
 * const binaryData = new Uint8Array([72, 101, 108, 108, 111]);
 * const hash = await digest('SHA-1', binaryData);
 * console.log(hash);
 *
 * @example
 * // Hash large text content
 * const content = 'Lorem ipsum dolor sit amet...';
 * const hash = await digest('SHA-512', content);
 * console.log(hash.length); // 64 bytes for SHA-512
 */
async function digest(algorithm, data) {
  // Convert string data to Uint8Array using optimized approach
  const binaryData = typeof data === "string" 
    ? new TextEncoder().encode(data)
    : data;

  // Get the appropriate crypto implementation for current environment
  const crypto = getCrypto();

  // Use Web Crypto API in browser environment for better performance and security
  if (typeof window !== "undefined") {
    const hashBuffer = await crypto.subtle.digest(algorithm, binaryData);
    return new Uint8Array(hashBuffer);
  }

  // Use Node.js crypto module in server environment
  // Convert Web Crypto API algorithm names to Node.js format if needed
  const nodeAlgorithm = algorithm.toLowerCase().replace('-', '');
  const hash = crypto.createHash(nodeAlgorithm).update(binaryData).digest();
  
  // Ensure consistent Uint8Array return type across environments
  return new Uint8Array(hash);
}

// ------------------------------------------------------------------------------------------------

export default digest;

// ------------------------------------------------------------------------------------------------