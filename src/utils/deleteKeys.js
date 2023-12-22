const isObject = require("../helpers/isObject.js");
// ------------------------------------------------------------------------------------------------

/**
 * @summary. Remove keys from object
 * @param {Object} object - The object that the keys must be deleted
 * @param {Array} keys - The array list of the keys that must be deleted
 * @returns {Object} - The object with the specified keys deleted
 */
function deleteKeys(object = {}, keys = []) {
  if (!Array.isArray(keys) || !isObject(object)) {
    return object;
  }
  for (let key of keys) {
    delete object[key];
  }
  return object;
}

// ------------------------------------------------------------------------------------------------

module.exports = deleteKeys;

// ------------------------------------------------------------------------------------------------
