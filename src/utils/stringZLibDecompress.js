const { unzlibSync, strFromU8 } = require("fflate");
const base64From = require("./base64From");

// ------------------------------------------------------------------------------------------------

/**
 * @summary. Returns a text decompressed
 * @param {String} zlibbed - The text to be decompressed
 * @param {Boolean} raw - If the text is base64 encoded
 * @returns {String} - The text decompresses
 */

function stringZLibDecompress(zlibbed, raw = false) {
  return new Promise((resolve, reject) => {
    try {
      if (!zlibbed) {
        return resolve("");
      }
      let uint8Array = zlibbed;
      if (!raw) {
        const decoded = base64From(zlibbed);
        uint8Array = new Uint8Array(decoded.split(","));
      }
      const decompressedString = unzlibSync(uint8Array);
      resolve(strFromU8(decompressedString));
    } catch (error) {
      reject(error);
    }
  });
}
// ------------------------------------------------------------------------------------------------

module.exports = stringZLibDecompress;
