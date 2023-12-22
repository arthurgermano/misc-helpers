// ------------------------------------------------------------------------------------------------

/**
 * @summary. Returns a text from a base64 format
 * @param {String} text - The text to be transformed
 * @param {String} fromFormat - From what format to expect - default: utf8
 * @returns {String} - The text transformed
 */

function base64From(text = "") {
  if (typeof text != "string" || !text) {
    return "";
  }
  return Buffer.from(text, "base64").toString();
}

// ------------------------------------------------------------------------------------------------

module.exports = base64From;
