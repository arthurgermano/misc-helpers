
/**
 * Generates a buffer from a given string in both Node.js and browser environments.
 *
 * @param {string} txtString - The string to convert to a buffer.
 * @param {string} [encoding="utf-8"] - The encoding to use (only applicable in Node.js).
 * @returns {Buffer|Uint8Array} The buffer representation of the string.
 *
 * @example
 * // Node.js usage
 * const buffer = bufferFromString('Hello, World!', 'utf-8');
 * console.log(buffer);
 *
 * // Browser usage
 * const buffer = bufferFromString('Hello, World!');
 * console.log(buffer);
 */
function bufferFromString(txtString, encoding = "utf-8") {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(txtString, encoding);
  }
  return new TextEncoder(encoding).encode(txtString).buffer;
}

// ------------------------------------------------------------------------------------------------

module.exports = bufferFromString;

// ------------------------------------------------------------------------------------------------
