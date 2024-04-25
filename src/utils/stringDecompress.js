const { decompressSync, strToU8, strFromU8 } = require("fflate");
const base64From = require("./base64From");

// ------------------------------------------------------------------------------------------------

/**
 * @summary. Returns a text decompressed
 * @param {String} gzipped - The text to be decompressed gzip
 * @param {Boolean} raw - If the text is base64 encoded
 * @returns {String} - The text decompresses
 */

function stringDecompress(gzipped, raw = false) {
  return new Promise((resolve, reject) => {
    try {
      if (!gzipped) {
        return resolve("");
      }
      let decoded = gzipped;
      if (!raw) {
        const buffer = Buffer.from(decoded, "base64");
        decoded = new Uint8Array(buffer);
      }
      const decompressedString = decompressSync(decoded);
      resolve(strFromU8(decompressedString));
    } catch (error) {
      reject(error);
    }
  });
}
// ------------------------------------------------------------------------------------------------

module.exports = stringDecompress;
