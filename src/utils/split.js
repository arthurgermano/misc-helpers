// ------------------------------------------------------------------------------------------------

/**
 * @summary. Return a string from a given value
 * @param {String} text - Value to be string
 * @param {Boolean} char - Char to split
 * @returns {String} - Returns an array
 */
function split(text, char = " ") {
  if (!text || typeof text != "string") {
    return [];
  }
  return text.split(char);
}

// ------------------------------------------------------------------------------------------------

module.exports = split;

// ------------------------------------------------------------------------------------------------
