const toString = require("../utils/toString.js");
// ------------------------------------------------------------------------------------------------

/**
 * @summary. Validates a given CPF
 * @param {String} cpf - Value to be checked
 * @returns {Boolean} - Returns if a given CPF is valid or not
 */
function validateCPF(cpf = "") {
  cpf = toString(cpf).replace(/[^\d]+/g, "");
  if (cpf == "" || cpf.length > 11) {
    return false;
  }
  cpf = cpf.padStart(11, "0");

  // Eliminating invalid CPF's
  if (
    cpf == "00000000000" ||
    cpf == "11111111111" ||
    cpf == "22222222222" ||
    cpf == "33333333333" ||
    cpf == "44444444444" ||
    cpf == "55555555555" ||
    cpf == "66666666666" ||
    cpf == "77777777777" ||
    cpf == "88888888888" ||
    cpf == "99999999999"
  ) {
    return false;
  }

  // Validate First Digit
  let add = 0;
  let rev;
  for (let i = 0; i < 9; i++) {
    add += parseInt(cpf.charAt(i)) * (10 - i);
  }

  rev = 11 - (add % 11);
  if (rev == 10 || rev == 11) {
    rev = 0;
  }
  if (rev != parseInt(cpf.charAt(9))) {
    return false;
  }

  // Validate Second Digit
  add = 0;
  for (let i = 0; i < 10; i++) {
    add += parseInt(cpf.charAt(i)) * (11 - i);
  }

  rev = 11 - (add % 11);
  if (rev == 10 || rev == 11) {
    rev = 0;
  }

  if (rev != parseInt(cpf.charAt(10))) {
    return false;
  }
  return true;
}

// ------------------------------------------------------------------------------------------------

module.exports = validateCPF;

// ------------------------------------------------------------------------------------------------
