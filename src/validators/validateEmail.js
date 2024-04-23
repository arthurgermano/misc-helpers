const toString = require("../utils/toString.js");
// ------------------------------------------------------------------------------------------------

/**
 * @summary. Validates a given Email
 * @param {String} email - Value to be checked
 * @returns {Boolean} - Returns if a given Email is valid or not
 */
function validateEmail(email = "") {
  email = toString(email);
  const regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
}

// ------------------------------------------------------------------------------------------------

module.exports = validateEmail;

// ------------------------------------------------------------------------------------------------
