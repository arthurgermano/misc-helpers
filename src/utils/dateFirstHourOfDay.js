const isInstanceOf = require("../helpers/isInstanceOf.js");

// ------------------------------------------------------------------------------------------------

/**
 * @summary. Returns the date with hour, minute and second equals to 00:00:00
 * @param {Date} stringDate - the object date
 * @returns {String} - Returns the date with hour, minute and second equals to 00:00:00
 */
function dateFirstHourOfDay(date) {
  if (!isInstanceOf(date, Date)) {
    return false;
  }

  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

// ------------------------------------------------------------------------------------------------

module.exports = dateFirstHourOfDay;

// ------------------------------------------------------------------------------------------------
