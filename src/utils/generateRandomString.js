// ------------------------------------------------------------------------------------------------

/**
 * @summary. Returns a new random string
 * @param {Integer} size - the size of the string should be
 * @param {Object} options - The options to customize behavior
 * @param {Boolean} options.excludeLowerCaseChars - Whether this function should exclude lower case chars - Default: false
 * @param {Boolean} options.excludeLowerCaseChars - Whether this function should exclude upper case chars - Default: false
 * @param {Boolean} options.excludeAccentedChars - Whether this function should exclude accented chars - Default: false
 * @param {Boolean} options.excludeDigits - Whether this function should exclude digits - Default: false
 * @param {Boolean} options.excludeSymbols - Whether this function should exclude Symbols - Default: false
 * @param {String} options.includeSymbols - A string with all the customized symbols to be added
 * @returns {String} - Returns a new random string
 */
function generateRandomString(
  size = 32,
  options = {
    excludeLowerCaseChars: false,
    excludeUpperCaseChars: false,
    excludeAccentedChars: false,
    excludeDigits: false,
    excludeSymbols: false,
    includeSymbols: ""
  }
) {
  let validChars = options.includeSymbols || "";
  let randomString = "";
  if (!options) {
    validChars = "àáâãçèéêìíîðñòóôõùúûýúabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*-_+=;:,.<>?"
  } else {
    if (!options.excludeLowerCaseChars) {
      validChars += "abcdefghijklmnopqrstuvwxyz"
    }
    if (!options.excludeUpperCaseChars) {
      validChars += "ABCDEFGHIJKLMNOPQRSTUVWXY"
    }
    if (!options.excludeAccentedChars) {
      validChars += "àáâãçèéêìíîðñòóôõùúûýú"
    }
    if (!options.excludeDigits) {
      validChars += "0123456789"
    }
    if (!options.excludeSymbols) {
      validChars += "!@#$%^&*-_+=;:,.<>?"
    }
  }

  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * validChars.length);
    randomString += validChars.charAt(randomIndex);
  }

  return randomString;
}

// ------------------------------------------------------------------------------------------------

module.exports = generateRandomString;
