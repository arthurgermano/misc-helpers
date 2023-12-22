const cloneDeep = require("lodash.clonedeep");

// ------------------------------------------------------------------------------------------------

/**
 * @summary. Returns a new object with the merge of other to two objects target and source
 * @param {Object} target - The target resulting object
 * @param {Object} source - The source object
 * @param {Boolean} throwsError - Whether this function should throw or ignore errors - Default: true
 * @returns {Object} - Returns a new object with the merge of other to two objects target and source
 */
function assign(target = {}, source = {}, throwsError = true) {
  if (typeof target != "object") {
    if (throwsError) {
      throw new Error("Assign Function: The target provided is not an object");
    } else {
      return null;
    }
  }
  if (typeof source != "object") {
    if (throwsError) {
      throw new Error("Assign Function: The source provided is not an object");
    } else {
      return null;
    }
  }

  try {
    return Object.assign(cloneDeep(target), cloneDeep(source));
  } catch (error) {
    if (throwsError) {
      throw error;
    }
  }
}

// ------------------------------------------------------------------------------------------------

module.exports = assign;

// ------------------------------------------------------------------------------------------------
