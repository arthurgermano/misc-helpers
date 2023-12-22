const toString = require("../utils/toString.js");
// ------------------------------------------------------------------------------------------------

/**
 * @summary. Validates a given CADICMS from Brazilian Paraná State
 * @param {String} cadicms - Value to be checked
 * @returns {Boolean} - Returns if a given CADICMS is valid or not
 */
function validateCADICMSPR(cadicms) {
  cadicms = toString(cadicms).replace(/[^\d]+/g, "");
  if (cadicms == "" || cadicms.length > 10) {
    return false;
  }
  cadicms = cadicms.padStart(10, "0");

  let b = 3;
  let sum = 0;
  for (let i = 0; i <= 7; i++) {
    sum += cadicms[i] * b;
    b--;
    if (b == 1) {
      b = 7;
    }
  }
  let i = sum % 11;
  let dig;
  if (i <= 1) {
    dig = 0;
  } else {
    dig = 11 - i;
  }

  if (!(dig == cadicms[8])) {
    return false;
  }

  b = 4;
  sum = 0;
  for (i = 0; i <= 8; i++) {
    sum += cadicms[i] * b;
    b--;
    if (b == 1) {
      b = 7;
    }
  }
  i = sum % 11;
  if (i <= 1) {
    dig = 0;
  } else {
    dig = 11 - i;
  }

  return dig == cadicms[9];
}

// ------------------------------------------------------------------------------------------------

module.exports = validateCADICMSPR;

// ------------------------------------------------------------------------------------------------
