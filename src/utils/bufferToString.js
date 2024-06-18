
/**
 * Generates a buffer from a given string in both Node.js and browser environments.
 *
 * @param {string} buffer - The string to convert to a buffer.
 * @param {string} [encoding="utf-8"] - The encoding to use (only applicable in Node.js).
 * @returns {Buffer|Uint8Array} The buffer representation of the string.
 *
 */
function bufferToString(buffer, encoding = "utf-8") {
  if (typeof Buffer !== "undefined") {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
  }
  return new TextDecoder(encoding).decode(buffer);
}

// ------------------------------------------------------------------------------------------------

module.exports = bufferToString;

// ------------------------------------------------------------------------------------------------
