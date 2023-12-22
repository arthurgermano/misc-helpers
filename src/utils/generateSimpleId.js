const toString = require("./toString");
// ------------------------------------------------------------------------------------------------

/**
 * @summary. Returns a new simple string id
 * @param {String} id - The string text identifier for this new id
 * @param {String} separator - The string separator between id parts
 * @returns {String} - Returns a new string id
 */
function generateSimpleId(id, separator = "_") {
  id = toString(id) + separator;
  if (id == separator) {
    id = "";
  }
  id += Date.now();
  id += separator + Math.floor(Math.random() * 9999999999999 + 1);
  return id;
}

// ------------------------------------------------------------------------------------------------

module.exports = generateSimpleId;
