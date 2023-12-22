const { DATE_ISO_FORMAT, DATE_BR_HOUR_FORMAT_D } = require("../constants.js");
const stringToDate = require("./stringToDate.js");
const dateToFormat = require("./dateToFormat.js");
const { parse } = require("date-fns/parse");
// ------------------------------------------------------------------------------------------------

/**
 * @summary. Returns a formatted string date
 * @param {String} stringDate - the string date text
 * @param {String} fromFormat - the string format in which the string date text is provided - default is yyyy-MM-dd'T'HH:mm:ss.SSS
 * @param {String} toFormat - the string format to be formatted - default is dd-MM-yyyy HH:mm:ss
 * @returns {String} - Returns the new string date formatted
 */
function stringToDateToFormat(
  stringDate,
  fromFormat = DATE_ISO_FORMAT,
  toFormat = DATE_BR_HOUR_FORMAT_D
) {
  try {
    const date = stringToDate(stringDate, fromFormat, false);
    if (date) {
      return dateToFormat(new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000), toFormat);
    }
  } catch (_) {}
  return false;
}

// ------------------------------------------------------------------------------------------------

module.exports = stringToDateToFormat;

// ------------------------------------------------------------------------------------------------
