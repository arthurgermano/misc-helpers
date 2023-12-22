const { DATE_ISO_FORMAT } = require("../constants.js");
const { parse } = require("date-fns/parse");
const toString = require("./toString");

// ------------------------------------------------------------------------------------------------

/**
 * @summary. Returns a new date object
 * @param {String} stringDate - the string date text
 * @param {String} stringFormat - the string format in which the string date text is provided - default is yyyy-MM-dd'T'HH:mm:ss.SSS'Z
 * @param {Date} defaultDate - the default date in case it fails
 * @returns {Date} - Returns a new date object from string provided
 */
function stringToDate(stringDate, stringFormat = DATE_ISO_FORMAT, defaultDate = new Date()) {
  return parse(toString(stringDate), stringFormat, defaultDate);
}

// ------------------------------------------------------------------------------------------------

module.exports = stringToDate;

// ------------------------------------------------------------------------------------------------
