const isNumber = require("../helpers/isNumber");
const toString = require("./toString");
// ------------------------------------------------------------------------------------------------

/**
 * @summary. Returns a text in a base64 format
 * @param {String} text - The text to be transformed
 * @param {String} fromFormat - From what format to expect
 * @returns {String} - The text transformed
 */

function base64To(text = "", fromFormat) {
  let b64;
  if (typeof window === "undefined") {
    if (isNumber(text)) {
      text = toString(text);
    }
    b64 = Buffer.from(text, fromFormat).toString("base64");
  } else {
    b64 = btoa(text);
  }
  return b64.replaceAll("=", "");
}

// ------------------------------------------------------------------------------------------------

module.exports = base64To;
