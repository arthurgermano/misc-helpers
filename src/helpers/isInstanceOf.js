// ------------------------------------------------------------------------------------------------

/**
 * @summary. Checks if a given object is of a certain instance type
 * @param {Any} object - object to be checked
 * @param {Any} instanceType - instance type to be checked
 * @returns {Boolean} - True if the object provided is the same type of the instance provided
 */
function isInstanceOf(object, instanceType) {
  return object instanceof instanceType;
}

// ------------------------------------------------------------------------------------------------

module.exports = isInstanceOf;

// ------------------------------------------------------------------------------------------------
