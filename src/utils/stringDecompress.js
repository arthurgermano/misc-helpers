const { decompressSync, strFromU8, strToU8 } = require("fflate");
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
        if (typeof window === "undefined") {
          decoded = Buffer.from(decoded, "base64");
          decoded = new Uint8Array(decoded);
        } else {
          decoded = atob(decoded);
          decoded = strToU8(decoded, true);
        }
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
