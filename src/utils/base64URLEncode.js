const toString = require("./toString");
const base64To = require("./base64To");
// ------------------------------------------------------------------------------------------------

/**
 * @summary. Return a base64 string url encoded
 * @param {Any} text - Value to be transformed
 * @returns {String} - Returns a base64 string url encoded
 */
function base64URLEncode(text = "", fromFormat = "utf8") {
  return base64To(toString(text), fromFormat)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

// ------------------------------------------------------------------------------------------------

module.exports = base64URLEncode;

// ------------------------------------------------------------------------------------------------
