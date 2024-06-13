const base64From = require("./base64From");

// ------------------------------------------------------------------------------------------------

/**
 * Converts a Base64 encoded string to a binary Buffer or ArrayBuffer.
 *
 * @param {string} base64String - The Base64 encoded string to decode.
 * @param {boolean} toString - If true and in Node.js environment, decode to UTF-8 string. Default is true.
 * @returns {Buffer|ArrayBuffer} - Decoded binary Buffer or ArrayBuffer.
 */
function base64ToBuffer(base64String, toString = true) {
  const binaryString = base64From(base64String, toString);
	if (ArrayBuffer.isView(binaryString)) {
		return binaryString;
	}
	const length = binaryString.length;
	const bytes = new Uint8Array(length);
	for (let i = 0; i < length; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}
	return bytes.buffer;
}

// ------------------------------------------------------------------------------------------------

module.exports = base64ToBuffer;

// ------------------------------------------------------------------------------------------------
