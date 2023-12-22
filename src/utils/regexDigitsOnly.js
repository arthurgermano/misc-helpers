const toString = require("./toString.js");

// ------------------------------------------------------------------------------------------------

/**
 * @summary. Return a string from a given value
 * @param {String} text - the text that has to be only digits
 * @returns {String} - Returns the text only with digits
 */
function regexDigitsOnly(text = "") {
  return toString(text)
    .replace(/[^0-9]/g, "")
    .trim();
}

// ------------------------------------------------------------------------------------------------

module.exports = regexDigitsOnly;

// ------------------------------------------------------------------------------------------------
