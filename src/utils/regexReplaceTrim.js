const toString = require("./toString.js");

// ------------------------------------------------------------------------------------------------

/**
 * @summary. Return a string with the regex replaced by the replacement informed
 * @param {String} text - String with the values to be replaced
 * @param {String} regex - The regex to should be kept
 * @param {String} replacement - The string that will replace in the regex
 * @returns {String} - Returns a string from the object provided
 */
function regexReplaceTrim(
  text = "",
  regex = "A-Za-zÀ-ú0-9 ",
  replacement = ""
) {
  return toString(text)
    .replace(new RegExp(`[^${toString(regex)}]`, "g"), toString(replacement))
    .trim();
}

// ------------------------------------------------------------------------------------------------

module.exports = regexReplaceTrim;

// ------------------------------------------------------------------------------------------------
