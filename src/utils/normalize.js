const isNumber = require("../helpers/isNumber");

// ------------------------------------------------------------------------------------------------

/**
 * @summary. Returns a text normalized
 * @param {String} text - The text to be normalized
 * @returns {String} - The text normalized
 */
function normalize(text = "") {
  if (isNumber(text) || typeof text == "string") {
    return text.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  return "";
}

// ------------------------------------------------------------------------------------------------

module.exports = normalize;
