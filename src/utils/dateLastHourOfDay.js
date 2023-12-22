const isInstanceOf = require("../helpers/isInstanceOf.js");

// ------------------------------------------------------------------------------------------------

/**
 * @summary. Returns the date with hour, minute and second equals to 00:00:00
 * @param {Date} stringDate - the object date
 * @returns {String} - Returns the date with hour, minute and second equals to 00:00:00
 */
function dateLastHourOfDay(date) {
  if (!isInstanceOf(date, Date)) {
    return false;
  }

  date.setHours(23);
  date.setMinutes(59);
  date.setSeconds(59);
  date.setMilliseconds(999);
  return date;
}

// ------------------------------------------------------------------------------------------------

module.exports = dateLastHourOfDay;

// ------------------------------------------------------------------------------------------------
