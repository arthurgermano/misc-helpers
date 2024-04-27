const { zlibSync, strToU8 } = require("fflate");
const base64To = require("./base64To");

// ------------------------------------------------------------------------------------------------

/**
 * @summary. Returns a text compressed
 * @param {String} text - The text to be transformed
 * @param {Boolean} raw - If it should return as the raw encoding zlib
 * @param {Integer} level - Level of compression
 * @param {Integer} mem - Memory usage
 * @returns {String} - The text gzipped
 */

function stringZLibCompress(text, raw = false, options = {}) {
  return new Promise((resolve, reject) => {
    try {
      if (!text) {
        return resolve("");
      }
      const buffer = strToU8(text);
      const compressedData = zlibSync(buffer, {
        level: options.level,
        mem: options.mem,
      });
      if (!raw) {
        return resolve(base64To(compressedData.join(",")));
      }
      resolve(compressedData);
    } catch (error) {
      reject(error);
    }
  });
}
// ------------------------------------------------------------------------------------------------

module.exports = stringZLibCompress;
