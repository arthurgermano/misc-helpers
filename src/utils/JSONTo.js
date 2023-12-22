// ------------------------------------------------------------------------------------------------

/**
 * @summary. Returns a text in a JSON format
 * @param {Object} object - The text to be transformed
 * @param {Boolean} throwsError - Whether this function should throw or ignore errors - Default: true
 * @returns {String} - The text transformed
 */

function JSONTo(object = {}, throwsError = true) {
  try {
    return JSON.stringify(object);
  } catch (error) {
    if (throwsError) {
      throw error;
    }
  }
  return null;
}

// ------------------------------------------------------------------------------------------------

module.exports = JSONTo;
