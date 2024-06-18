const base64To = require("./base64To");

// ------------------------------------------------------------------------------------------------

/**
 * Converts an ArrayBuffer to a Base64 string.
 *
 * @param {ArrayBuffer} buffer - The ArrayBuffer to convert to Base64.
 * @returns {string} The Base64-encoded string representation of the ArrayBuffer.
 *
 * @example
 * // Example usage
 * const arrayBuffer = new ArrayBuffer(16);
 * const view = new Uint8Array(arrayBuffer);
 * for (let i = 0; i < view.length; i++) {
 *     view[i] = i;
 * }
 * const base64String = base64FromBuffer(arrayBuffer);
 * console.log('Base64 Encoded:', base64String);
 */
function base64FromBuffer(buffer) {
  if (typeof window === "undefined") {
    return base64To(Buffer.from(buffer));
  }
  const bytes = new Uint8Array(buffer);
  const txt = String.fromCharCode.apply(null, bytes);
  return base64To(txt);
}

// ------------------------------------------------------------------------------------------------

module.exports = base64FromBuffer;

// ------------------------------------------------------------------------------------------------
