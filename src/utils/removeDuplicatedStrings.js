const toString = require("./toString.js");
const isObject = require("../helpers/isObject");
// ------------------------------------------------------------------------------------------------

/**
 * @summary. Return a string with duplicated strings removed
 * @param {String} text - Value to be checked
 * @param {String} splitString - The split string char
 * @returns {String} - Returns a string with duplicated strings removed
 */
function removeDuplicatedStrings(
  text,
  splitString = " ",
  caseInsensitive = false
) {
  if (isObject(text)) {
    return "";
  }
  const array = toString(text).trim().split(toString(splitString));
  if (!caseInsensitive) {
    return [...new Set(array)].filter((v) => v).join(splitString);
  }
  const object = {};
  for (let i in array) {
    object[array[i].toLowerCase()] = i;
  }
  const indexes = Object.values(object);
  return array
    .filter((v, i) => v && indexes.includes(i.toString()))
    .join(splitString);
}

// ------------------------------------------------------------------------------------------------

module.exports = removeDuplicatedStrings;

// ------------------------------------------------------------------------------------------------
