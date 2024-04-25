const toString = require("./toString.js");

// ------------------------------------------------------------------------------------------------

/**
 * @summary. Returns a text in a base64 format
 * @param {String} text - The text to be transformed
 * @param {String} fromFormat - From what format to expect - default: utf8
 * @returns {String} - The text transformed
 */

function base64To(text = "", fromFormat = "utf8") {
  if (typeof window === "undefined") {
    return Buffer.from(toString(text), fromFormat)
      .toString("base64")
      .replaceAll("=", "");
  }
  return btoa(text);
}

// ------------------------------------------------------------------------------------------------

module.exports = base64To;
