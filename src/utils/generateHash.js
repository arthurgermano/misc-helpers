const toString = require("./toString.js");
const { createHash } = require("crypto");

// ------------------------------------------------------------------------------------------------

/**
 * @summary. Return a string from a given value
 * @param {String} text - The text to be hashed
 * @param {String} encode - The text to be encoded - Default: base64
 * @param {String} algorithm - The HASH algorithm - Default: sha256
 * @returns {String} - Returns a string from the object provided
 */
function generateHash(text = "", encode = "base64", algorithm = "sha256") {
  text = toString(text).trim();
  if (text == "") return false;
  try {
    const hash = createHash(algorithm).update(text).digest(encode);
    if (typeof hash === "string") {
      return hash;
    }
  } catch (_) {}
  return false;
}

// ------------------------------------------------------------------------------------------------

module.exports = generateHash;

// ------------------------------------------------------------------------------------------------
