// ------------------------------------------------------------------------------------------------

/**
 * @summary. Return a uint8Array
 * @param {String} text - Value to be string
 * @param {String} joinChar - Char to join if specified
 * @returns {String} - Returns an array
 */
function uint8ArrayFromString(text = "", joinChar) {
  let uint8Array;
  if (typeof window === "undefined") {
    const buffer = Buffer.from(text, "utf-8");
    uint8Array = new Uint8Array(buffer);
  } else {
    const buffer = new ArrayBuffer(text.length);
    uint8Array = new Uint8Array(buffer);
    for (let i = 0; i < text.length; i++) {
      uint8Array[i] = text.charCodeAt(i);
    }
  }

  if (!joinChar) {
    return uint8Array;
  }

  return uint8Array.join(joinChar);
}

// ------------------------------------------------------------------------------------------------

module.exports = uint8ArrayFromString;

// ------------------------------------------------------------------------------------------------
