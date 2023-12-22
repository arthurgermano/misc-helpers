const toString = require("./toString.js");

// ------------------------------------------------------------------------------------------------

/**
 * @summary. Returns a text normalized
 * @param {String} text - The text to be normalized
 * @returns {String} - The text normalized
 */
function normalize(text = "") {
  text = toString(text);
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// ------------------------------------------------------------------------------------------------

module.exports = normalize;
