// ------------------------------------------------------------------------------------------------

/**
 * @summary. Checks if a given value is a numeric value
 * @param {Any} value - Value to be checked
 * @returns {Boolean} - True if the value provided is numeric, false if not
 */
function isNumber(value) {
  return (
      typeof value === 'number' &&
      !isNaN(value) &&
      Number.isFinite(value)
  );
}

// ------------------------------------------------------------------------------------------------

module.exports = isNumber;

// ------------------------------------------------------------------------------------------------