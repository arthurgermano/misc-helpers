const isInstanceOf = require("./isInstanceOf.js");

// ------------------------------------------------------------------------------------------------

/**
 * @summary. Returns if a given dateA is in a later time than dateB
 * @param {Date} dateA - later date to be checked
 * @param {Date} dateB - earlier date to be checked
 * @param {Object} options - The options to customize behavior
 * @param {Boolean} options.ignoreErrors - Whether this function should throw or ignore errors - Default: false
 * @param {Boolean} options.considerHMS - Whether should keep hours minutes and seconds or not - Default: false
 * @param {Boolean} options.considerEquals - If the date are the same time should be considered true or not - Default: false
 * @returns {Boolean} - Returns true if the later date(dateA) is in a late time than dateB
 */
function dateCompareDesc(
  dateA,
  dateB,
  options = { considerHMS: false, ignoreErrors: false, considerEquals: false }
) {
  if (!isInstanceOf(dateA, Date)) {
    if (options && !options.ignoreErrors) {
      throw new Error(
        "dateCompareDesc Function: dateA provided is not a Date Object"
      );
    }
    return null;
  }
  if (!isInstanceOf(dateB, Date)) {
    if (options && !options.ignoreErrors) {
      throw new Error(
        "dateCompareDesc Function: dateB provided is not a Date Object"
      );
    }
    return null;
  }

  try {
    let timeA;
    let timeB;
    if (options && !options.considerHMS) {
      timeA = new Date(dateA.getFullYear(), dateA.getMonth(), dateA.getDate()).getTime();
      timeB = new Date(dateB.getFullYear(), dateB.getMonth(), dateB.getDate()).getTime();
    } else {
      timeA = dateA.getTime();
      timeB = dateB.getTime();
    }
    if (timeA > timeB) {
      return true;
    }
    if (timeA == timeB && options && options.considerEquals) {
      return true;
    }
    return false;
  } catch (error) {
    if (options && !options.ignoreErrors) {
      throw error;
    }
    return null;
  }
}

// ------------------------------------------------------------------------------------------------

module.exports = dateCompareDesc;

// ------------------------------------------------------------------------------------------------
