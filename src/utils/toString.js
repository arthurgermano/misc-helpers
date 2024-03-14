// ------------------------------------------------------------------------------------------------

/**
 * @summary. Return a string from a given value
 * @param {Any} textObj - Value to be string
 * @param {Boolean} objectToJSON - Whether it should transform objects to JSON stringfied form
 * @returns {String} - Returns a string from the object provided
 */
function toString(textObj = "", objectToJSON = true) {
  let textString = "";
  if (typeof textObj != "string") {
    if (!textObj) {
      return textString;
    } else if (textObj.toString) {
      textString = textObj.toString();
    } 
    if (objectToJSON && textString == "[object Object]") {
      try {
        textString = JSON.stringify(textObj)
      } catch (_) {
        return textObj.toString();
      }
    }
    return textString;
  }
  return textObj;
}

// ------------------------------------------------------------------------------------------------

module.exports = toString;

// ------------------------------------------------------------------------------------------------
