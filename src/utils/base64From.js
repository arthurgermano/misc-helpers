// ------------------------------------------------------------------------------------------------

/**
 * Converts a Base64 encoded string to plain text (UTF-8) or a Buffer,
 * depending on the environment and options.
 *
 * @param {string} text - The Base64 encoded string to decode.
 * @param {boolean} toString - If true and in Node.js environment, decode to UTF-8 string. Default is true.
 * @returns {string|Buffer} - Decoded plain text (UTF-8) string or Buffer.
 */
function base64From(text = "", toString = true) {
  if (typeof text != "string" || !text) {
    return "";
  }
  if (typeof window === 'undefined') {
    if (toString) {
      return Buffer.from(text, "base64").toString();
    }
    return Buffer.from(text, "base64");
  }
  return atob(text);
}

// ------------------------------------------------------------------------------------------------

module.exports = base64From;
