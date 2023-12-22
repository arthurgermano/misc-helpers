const { DATE_BR_FORMAT_D } = require("../constants.js");
const { format } = require("date-fns/format");
const isInstanceOf = require("../helpers/isInstanceOf.js");

// ------------------------------------------------------------------------------------------------

/**
 * @summary. Returns a string formatted date
 * @param {Date} stringDate - the object date
 * @param {String} stringFormat - the string format in which the string date object must be formatted - default is dd-MM-yyyy
 * @returns {String} - Returns a string formatted as specified
 */
function dateToFormat(date, stringFormat = DATE_BR_FORMAT_D) {
  if (!isInstanceOf(date, Date)) {
    return "false";
  }

  return format(date, stringFormat);
}

// ------------------------------------------------------------------------------------------------

module.exports = dateToFormat;

// ------------------------------------------------------------------------------------------------
