const { DATE_BR_FORMAT_D } = require("../../../constants.js");
const stringToDate = require("../../../utils/stringToDate.js");
const dateFirstHourOfDay = require("../../../utils/dateFirstHourOfDay.js");
const dateLastHourOfDay = require("../../../utils/dateLastHourOfDay.js");

// ------------------------------------------------------------------------------------------------

/**
 * @summary. Returns the between conditions in an object format
 * @param {Object} object - the object with the dates
 * @param {String} fromFormat - The string format in which the date is expected to be - Default: dd-MM-yyyy
 * @param {String} key - The key name that holds the date object
 * @param {String} beforeKey - The key name that holds the until date object
 * @param {String} afterKey - The key name that holds the from date object
 * @returns {Object} - Returns the between conditions in an object format
 */
function setConditionBetweenDates(
  object,
  fromFormat = DATE_BR_FORMAT_D,
  key = "created_at",
  beforeKey = "created_at_until",
  afterKey = "created_at_from",
  resetHMS = true
) {
  if (!object || (!object[afterKey] && !object[beforeKey])) {
    return null;
  }
  if (object[afterKey]) {
    object[key] = {
      $and: [
        {
          $gte: resetHMS
            ? dateFirstHourOfDay(stringToDate(object[afterKey], fromFormat))
            : stringToDate(object[afterKey], fromFormat),
        },
      ],
    };
    delete object[afterKey];
  }
  if (object[beforeKey]) {
    if (object[key]) {
      object[key].$and.push({
        $lte: resetHMS
          ? dateLastHourOfDay(stringToDate(object[beforeKey], fromFormat))
          : stringToDate(object[beforeKey], fromFormat),
      });
    } else {
      object[key] = {
        $and: [
          {
            $lte: resetHMS
              ? dateLastHourOfDay(stringToDate(object[beforeKey], fromFormat))
              : stringToDate(object[beforeKey], fromFormat),
          },
        ],
      };
    }
    delete object[beforeKey];
  }
  return object;
}

// ------------------------------------------------------------------------------------------------

module.exports = setConditionBetweenDates;

// ------------------------------------------------------------------------------------------------
