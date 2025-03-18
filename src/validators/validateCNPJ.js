const toString = require("../utils/toString.js");

// ------------------------------------------------------------------------------------------------

const WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

// ------------------------------------------------------------------------------------------------

/**
 * @summary Validates a given CNPJ
 * @param {String} cnpj - The CNPJ value to be validated
 * @param {Object} [options={}] - Additional validation options
 * @param {String} [options.addPaddingChar="0"] - Character to use for padding if necessary
 * @param {Array<Number>} [options.weights=WEIGHTS] - Custom weight values for validation
 * @param {Boolean} [options.ignoreToUpperCase=true] - Whether to ignore case when processing alphanumeric CNPJs. If true, all characters will be converted to uppercase.
 * @param {Boolean} [options.ignorePadding=false] - Whether to skip padding when the CNPJ is shorter than 14 characters. If true, padding will not be applied.
 * @returns {Boolean} - Returns true if the CNPJ is valid, otherwise false
 */
function validateCNPJ(cnpj = "", options = {}) {
  // Normalize input: remove mask characters and apply padding
  cnpj = toString(cnpj).replace(/[./-]/g, "");

  if (!options.ignorePadding) {
    cnpj = cnpj.padStart(14, options.addPaddingChar || "0");
  }

  if (!options.ignoreToUpperCase) {
    cnpj = cnpj.toUpperCase();
  }

  // Generate a string with all zeros to compare against (invalid case)
  const zeroedCNPJ = "00000000000000";
  if (cnpj === zeroedCNPJ) {
    return false;
  }

  // Validate format: 12 alphanumeric characters followed by 2 numeric check digits
  const regexCNPJ = /^([A-Z\d]){12}(\d){2}$/;
  if (!regexCNPJ.test(cnpj)) {
    return false;
  }

  // Extract base and check digits
  const baseDigits = cnpj.substring(0, 12);
  const checkDigits = cnpj.substring(12);

  // Calculate expected check digits
  const calculatedDV = calculateDV(
    baseDigits,
    options.noDigitSize,
    options.weights || WEIGHTS
  );

  // Compare calculated check digits with provided ones
  return checkDigits === calculatedDV;
}

// ------------------------------------------------------------------------------------------------

/**
 * @summary Calculates the verification digits for a CNPJ
 * @param {String} cnpj - The CNPJ base (first 12 characters)
 * @param {Number} [noDigitSize=12] - Number of base digits before check digits
 * @param {Array<Number>} weights - Weight values for the calculation
 * @returns {String} - The two verification digits
 */
function calculateDV(cnpj, noDigitSize = 12, weights) {
  let sumDV1 = 0;
  let sumDV2 = 0;

  // Calculate weighted sums for the first and second check digits
  for (let i = 0; i < noDigitSize; i++) {
    const digit = cnpj.charCodeAt(i) - "0".charCodeAt(0);
    sumDV1 += digit * weights[i + 1];
    sumDV2 += digit * weights[i];
  }

  // Compute first verification digit
  const dv1 = sumDV1 % 11 < 2 ? 0 : 11 - (sumDV1 % 11);
  sumDV2 += dv1 * weights[12];

  // Compute second verification digit
  const dv2 = sumDV2 % 11 < 2 ? 0 : 11 - (sumDV2 % 11);

  return `${dv1}${dv2}`;
}

// ------------------------------------------------------------------------------------------------

module.exports = validateCNPJ;

// ------------------------------------------------------------------------------------------------

// const toString = require("../utils/toString.js");
// // ------------------------------------------------------------------------------------------------

// /**
//  * @summary. Validates a given CNPJ
//  * @param {String} cnpj - Value to be checked
//  * @returns {Boolean} - Returns if a given CNPJ is valid or not
//  */
// function validateCNPJ(cnpj = "") {
//   cnpj = toString(cnpj).replace(/[^\d]+/g, "");
//   if (cnpj == "" || cnpj.length > 14) {
//     return false;
//   }
//   cnpj = cnpj.padStart(14, "0");

//   // Eliminate known invalid CNPJs
//   if (
//     cnpj == "00000000000000" ||
//     cnpj == "11111111111111" ||
//     cnpj == "22222222222222" ||
//     cnpj == "33333333333333" ||
//     cnpj == "44444444444444" ||
//     cnpj == "55555555555555" ||
//     cnpj == "66666666666666" ||
//     cnpj == "77777777777777" ||
//     cnpj == "88888888888888" ||
//     cnpj == "99999999999999"
//   ) {
//     return false;
//   }

//   // Validate Verifier Digits
//   let size = cnpj.length - 2;
//   let numbers = cnpj.substring(0, size);
//   let digits = cnpj.substring(size);
//   let sum = 0;
//   let pos = size - 7;
//   for (let i = size; i >= 1; i--) {
//     sum += numbers.charAt(size - i) * pos--;
//     if (pos < 2) {
//       pos = 9;
//     }
//   }
//   let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
//   if (result != digits.charAt(0)) {
//     return false;
//   }

//   size = size + 1;
//   numbers = cnpj.substring(0, size);
//   sum = 0;
//   pos = size - 7;
//   for (let i = size; i >= 1; i--) {
//     sum += numbers.charAt(size - i) * pos--;
//     if (pos < 2) {
//       pos = 9;
//     }
//   }
//   result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
//   if (result != digits.charAt(1)) {
//     return false;
//   }
//   return true;
// }

// // ------------------------------------------------------------------------------------------------

// module.exports = validateCNPJ;

// // ------------------------------------------------------------------------------------------------
