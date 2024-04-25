const { unzlibSync, strToU8, strFromU8 } = require("fflate");
const base64From = require("./base64From");

// ------------------------------------------------------------------------------------------------

/**
 * @summary. Returns a text decompressed
 * @param {String} zlibbed - The text to be decompressed
 * @param {Boolean} raw - If the text is base64 encoded
 * @returns {String} - The text decompresses
 */

function stringDecompress(zlibbed, raw = false) {
  return new Promise((resolve, reject) => {
    try {
      if (!zlibbed) {
        return resolve("");
      }
      let decoded = zlibbed;
      if (!raw) {
        if (typeof window === 'undefined') {
          decoded = Buffer.from(decoded, 'base64');
          decoded = new Uint8Array(decoded);
        } else {
          decoded = atob(decoded);
          decoded = strToU8(decoded, true);
        }
      }
      const decompressedString = unzlibSync(decoded);
      resolve(strFromU8(decompressedString));
    } catch (error) {
      reject(error);
    }
  });
}
// ------------------------------------------------------------------------------------------------

module.exports = stringDecompress;
