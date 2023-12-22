const toString = require("../utils/toString.js");
// ------------------------------------------------------------------------------------------------

/**
 * @summary. Validates a given CNPJ
 * @param {String} cnpj - Value to be checked
 * @returns {Boolean} - Returns if a given CNPJ is valid or not
 */
function validateCNPJ(cnpj = "") {
  cnpj = toString(cnpj).replace(/[^\d]+/g, "");
  if (cnpj == "" || cnpj.length > 14) {
    return false;
  }
  cnpj = cnpj.padStart(14, "0");

  // Eliminate known invalid CNPJs
  if (
    cnpj == "00000000000000" ||
    cnpj == "11111111111111" ||
    cnpj == "22222222222222" ||
    cnpj == "33333333333333" ||
    cnpj == "44444444444444" ||
    cnpj == "55555555555555" ||
    cnpj == "66666666666666" ||
    cnpj == "77777777777777" ||
    cnpj == "88888888888888" ||
    cnpj == "99999999999999"
  ) {
    return false;
  }

  // Validate Verifier Digits
  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  let digits = cnpj.substring(size);
  let sum = 0;
  let pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result != digits.charAt(0)) {
    return false;
  }

  size = size + 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result != digits.charAt(1)) {
    return false;
  }
  return true;
}

// ------------------------------------------------------------------------------------------------

module.exports = validateCNPJ;

// ------------------------------------------------------------------------------------------------
