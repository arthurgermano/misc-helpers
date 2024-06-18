const base64From = require("./base64From");

// ------------------------------------------------------------------------------------------------

/**
 * Converts a Base64 encoded string to a binary Buffer or ArrayBuffer.
 *
 * @param {string} base64String - The Base64 encoded string to decode.
 * @returns {Buffer|ArrayBuffer} - Decoded binary Buffer or ArrayBuffer.
 */
function base64ToBuffer(base64String) {
  let binaryString;
  if (typeof Buffer === "function") {
    const b64Buffer = Buffer.from(base64String, "base64");
    return b64Buffer.buffer.slice(b64Buffer.byteOffset, b64Buffer.byteOffset + b64Buffer.byteLength);
  } else if (
    typeof window !== "undefined" &&
    typeof window.atob === "function"
  ) {
    // Browser environment using ArrayBuffer and Uint8Array
    binaryString = atob(base64String);
  }
  const length = binaryString.length;
  const bytes = new Uint8Array(length);

  for (let i = 0; i < length; ++i) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// ------------------------------------------------------------------------------------------------

module.exports = base64ToBuffer;

// ------------------------------------------------------------------------------------------------
