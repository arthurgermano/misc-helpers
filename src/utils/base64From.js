// ------------------------------------------------------------------------------------------------

/**
 * Converts a Base64 encoded string to plain text (UTF-8) or a Buffer,
 * depending on the environment and options.
 *
 * @param {string} text - The Base64 encoded string to decode.
 * @returns {string|Buffer} - Decoded plain text (UTF-8) string or Buffer.
 */
function base64From(text = "") {
  if (typeof text != "string" || !text) {
    return "";
  }
  if (typeof window === "undefined") {
    return Buffer.from(text, "base64").toString("utf-8");
  }
  return atob(text);
}

// ------------------------------------------------------------------------------------------------

module.exports = base64From;
