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
      let uint8Array = gzipped;
      if (!raw) {
        let decoded;
        if (typeof window === "undefined") {
          decoded = Buffer.from(gzipped, "base64").toString();
        } else {
          decoded = atob(gzipped);
        }
        uint8Array = new Uint8Array(decoded.split(","));
      }
      const decompressedString = decompressSync(uint8Array);
      resolve(strFromU8(decompressedString));
    } catch (error) {
      reject(error);
    }
  });
}
// ------------------------------------------------------------------------------------------------

module.exports = stringDecompress;
