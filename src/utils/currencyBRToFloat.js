const toString = require("./toString.js");
const isNumber = require("../helpers/isNumber.js");
// ------------------------------------------------------------------------------------------------

/**
 * @summary. Return a string from a given value
 * @param {String} moneyString - moneyString to be transformed
 * @returns {Float} - Returns the float of the string provided
 */
function currencyBRToFloat(moneyString) {
  if (isNumber(moneyString)) {
    return moneyString;
  }

  let cleanedString = toString(moneyString).replace(/\./g, "");
  cleanedString = cleanedString.replace(/,/g, ".");
  cleanedString = cleanedString.replace("R", "");
  cleanedString = cleanedString.replace("$", "").trim();

  if (/[A-Za-zÀ-ú]/g.test(cleanedString)) {
    return false;
  }
  try {
    const result = parseFloat(cleanedString);
    if (isNumber(result)) {
      return result;
    }
  } catch (_) {}
  return false;
}

// ------------------------------------------------------------------------------------------------

module.exports = currencyBRToFloat;

// ------------------------------------------------------------------------------------------------
