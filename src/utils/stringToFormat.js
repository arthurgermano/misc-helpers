const toString = require("./toString");
const regexDigitsOnly = require("./regexDigitsOnly");
const { STRING_FORMAT_CNPJ } = require("../constants.js");

// ------------------------------------------------------------------------------------------------

/**
 * @summary. Returns a string with a given pattern
 * @param {Any} text - the text provided
 * @param {String} pattern - the patterns it should return - Default: "##.###.###/####-##"
 * @returns {String} - returns a new string pattern
 */
function stringToFormat(text, pattern = STRING_FORMAT_CNPJ) {
  const size = pattern.split("#").length - 1;
  let result = '';
  let valueIndex = 0;
  text = regexDigitsOnly(toString(text)).padStart(size, '0');

  for (let i = 0; i < pattern.length; i++) {
      const char = pattern[i];
      if (char === '#') {
          result += text[valueIndex++] || '0';
      } else {
          result += char;
      }
  }

  return result;
}

// ------------------------------------------------------------------------------------------------

module.exports = stringToFormat;

// ------------------------------------------------------------------------------------------------
