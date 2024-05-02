// ------------------------------------------------------------------------------------------------

/**
 * @summary. Return a uint8Array
 * @param {String} text - Value to be string
 * @param {String} splitChar - Char to split if specified
 * @returns {String} - Returns an array
 */
function uint8ArrayToString(uint8Array, splitChar) {
  if (!uint8Array) {
    return "";
  }
  if (splitChar) {
    uint8Array = uint8Array.split(splitChar);
  }
  if (typeof window === "undefined") {
    const buffer = Buffer.from(uint8Array);
    return buffer.toString("utf-8");
  }
  let text = "";
  for (let i = 0; i < uint8Array.length; i++) {
    text += String.fromCharCode(uint8Array[i]);
  }

  return text;
}

// ------------------------------------------------------------------------------------------------

module.exports = uint8ArrayToString;

// ------------------------------------------------------------------------------------------------
