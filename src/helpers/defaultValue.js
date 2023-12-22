// ------------------------------------------------------------------------------------------------

/**
 * @summary. Return a default value instead of empty
 * @param {Any} checkValue - Value to be checked
 * @param {Any} defaultValue - The default value to be returned in case the value provided is empty or null
 * @returns {Any} - Returns the value provided or the default value
 */
function defaultValue(checkValue, defaultValue) {
  if (checkValue === null || checkValue === undefined) {
    return defaultValue;
  }
  return checkValue;
}

// ------------------------------------------------------------------------------------------------

module.exports = defaultValue;

// ------------------------------------------------------------------------------------------------