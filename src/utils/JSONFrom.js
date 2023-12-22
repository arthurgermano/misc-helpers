// ------------------------------------------------------------------------------------------------

/**
 * @summary. Returns a object from a JSON string
 * @param {String} text - The text to be transformed
 * @param {Boolean} throwsError - Whether this function should throw or ignore errors - Default: true
 * @returns {Object} - The text transformed
 */

function JSONFrom(text, throwsError = true) {
  try {
    return JSON.parse(text);
  } catch (error) {
    if (throwsError) {
      throw error;
    }
  }
  return null;
}

// ------------------------------------------------------------------------------------------------

module.exports = JSONFrom;
