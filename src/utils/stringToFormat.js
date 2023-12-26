const toString = require("./toString");
const regexDigitsOnly = require("./regexDigitsOnly");
const { STRING_FORMAT_CNPJ } = require("../constants.js");

// ------------------------------------------------------------------------------------------------

/**
 * @summary. Returns a string with a given pattern
 * @param {Any} text - the text provided
 * @param {String} pattern - the patterns it should return - Default: "##.###.###/####-##"
 * @param {Object} options - The options to customize behavior
 * @param {Boolean} options.digitsOnly - Whether this function should apply digits only - Default: false
 * @param {Boolean} options.paddingChar - Whether this function should apply a different padding char - Default: 0
 * @returns {String} - returns a new string pattern
 */
function stringToFormat(
  text,
  pattern = STRING_FORMAT_CNPJ,
  options = { digitsOnly: false, paddingChar: "0" }
) {
  const size = pattern.split("#").length - 1;

  if (!options || !options.paddingChar) {
    options.paddingChar = "0";
  }
  if (options || options.digitsOnly) {
    text = regexDigitsOnly(toString(text));
  }

  text = text.padStart(size, options.paddingChar);

  let result = "";
  let valueIndex = 0;
  for (let i = 0; i < pattern.length; i++) {
    const char = pattern[i];
    if (char === "#") {
      result += text[valueIndex++] || options.paddingChar;
    } else {
      result += char;
    }
  }

  return result;
}

// ------------------------------------------------------------------------------------------------

module.exports = stringToFormat;

// ------------------------------------------------------------------------------------------------
