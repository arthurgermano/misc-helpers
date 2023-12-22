const toString = require("./toString.js");

// ------------------------------------------------------------------------------------------------

/**
 * @summary. Return a string from a given value
 * @param {String} text - the text that has to be only letters
 * @returns {String} - Returns the text only with letters
 */
function regexLettersOnly(text = "") {
  return toString(text)
    .replace(/[^A-Za-zÀ-ú]/g, "")
    .trim();
}

// ------------------------------------------------------------------------------------------------

module.exports = regexLettersOnly;

// ------------------------------------------------------------------------------------------------
