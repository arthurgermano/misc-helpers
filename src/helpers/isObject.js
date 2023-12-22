// ------------------------------------------------------------------------------------------------

/**
 * @summary. Checks if a given object is an object
 * @param {Any} object - object to be checked
 * @returns {Boolean} - True if the object provided is object, false if not
 */
function isObject(object) {
  if (object && typeof object === "object") {
    return true;
  }
  return false;
}

// ------------------------------------------------------------------------------------------------

module.exports = isObject;

// ------------------------------------------------------------------------------------------------
