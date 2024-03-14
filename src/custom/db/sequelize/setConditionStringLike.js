// ------------------------------------------------------------------------------------------------

/**
 * @summary. Returns the string like condition format
 * @param {Object} object - the object with the values
 * @param {String} key - The key name that holds the value object
 * @param {Boolean} key - Whether it should be insensitive or not - default: true
 * @returns {Object} - Returns the string like condition formatted
 */
function setConditionStringLike(object, key, insensitive = true) {
  if (!key || !object || !object[key]) {
    return;
  }
  if (insensitive) {
    object[key] = {
      $iLike: `%${object[key]}%`,
    };
    return;
  }
  object[key] = {
    $like: `%${object[key]}%`,
  };
}

// ------------------------------------------------------------------------------------------------

module.exports = setConditionStringLike;

// ------------------------------------------------------------------------------------------------
