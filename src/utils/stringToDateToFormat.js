const { DATE_ISO_FORMAT } = require("../constants.js");
const stringToDate = require("./stringToDate");
const dateToFormat = require("./dateToFormat");

// ------------------------------------------------------------------------------------------------

/**
 * @summary. Returns a formatted string date
 * @param {String} stringDate - the string date text
 * @param {String} fromFormat - the string format in which the string date text is provided - default is yyyy-MM-dd'T'HH:mm:ss.SSS'Z
 * @param {String} toFormat - the string format to be formatted
 * @returns {String} - Returns the new string date formatted
 */
function stringToDateToFormat(
  stringDate,
  fromFormat = DATE_ISO_FORMAT,
  toFormat
) {
  try {
    return dateToFormat(stringToDate(stringDate, fromFormat), toFormat);
  } catch (_) {
    return false;
  }
}

// ------------------------------------------------------------------------------------------------

module.exports = stringToDateToFormat;

// ------------------------------------------------------------------------------------------------
