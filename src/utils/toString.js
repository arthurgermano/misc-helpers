// ------------------------------------------------------------------------------------------------

/**
 * @summary. Return a string from a given value
 * @param {Any} text - Value to be string
 * @returns {String} - Returns a string from the object provided
 */
function toString(text = "") {
  if (typeof text != "string") {
    if (text.toString) {
      text = text.toString();
    } else {
      text = String(text);
    }
  }
  return text;
}

// ------------------------------------------------------------------------------------------------

module.exports = toString;

// ------------------------------------------------------------------------------------------------