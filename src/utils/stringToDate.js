const { DATE_ISO_FORMAT, DATE_ISO_FORMAT_TZ } = require("../constants.js");
const { parse } = require("date-fns/parse");
const isInstanceOf = require("../helpers/isInstanceOf");

// ------------------------------------------------------------------------------------------------

/**
 * @summary. Returns a new date object
 * @param {String} stringDate - the string date text
 * @param {String} stringFormat - the string format in which the string date text is provided - default is yyyy-MM-dd'T'HH:mm:ss.SSS'Z
 * @param {Date} defaultDate - the default date in case it fails
 * @returns {Date} - Returns a new date object from string provided
 */
function stringToDate(
  stringDate,
  stringFormat = DATE_ISO_FORMAT,
  defaultDate = new Date()
) {
  try {
    if (typeof stringDate !== "string") {
      return defaultDate;
    }

    let date = parse(stringDate, stringFormat, defaultDate || new Date());
    if (!isInstanceOf(date, Date) || isNaN(date.getTime())) {
      if (!defaultDate) {
        return false;
      }
      date = defaultDate;
    }

    return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  } catch (_) {}
  return false;
}

// ------------------------------------------------------------------------------------------------

module.exports = stringToDate;

// ------------------------------------------------------------------------------------------------
