/**
 * Converts a URL-safe base64 encoded string to a standard base64 encoded string.
 *
 * URL-safe base64 encoding replaces `+` with `-` and `/` with `_` to make the
 * string safe for use in URLs. This function converts these characters back to
 * their standard base64 counterparts and adds padding characters (`=`) if
 * necessary to make the string length a multiple of 4.
 *
 * @param {string} urlSafeBase64 - The URL-safe base64 encoded string to convert.
 * @returns {string} The standard base64 encoded string.
 *
 * @example
 * const urlSafeBase64String = 'rqXRQrq_mSFhX4c2wSZJrA';
 * const base64String = base64FromBase64URLSafe(urlSafeBase64String);
 * console.log(base64String); // Output: 'rqXRQrq/mSFhX4c2wSZJrA=='
 */
function base64FromBase64URLSafe(urlSafeBase64) {
  if (!urlSafeBase64) {
    return "";
  }
  // Replace URL-safe characters with base64 standard characters
  let base64 = urlSafeBase64.toString().replace(/-/g, "+").replace(/_/g, "/");

  // Add padding if necessary
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }

  return base64;
}

// ------------------------------------------------------------------------------------------------

module.exports = base64FromBase64URLSafe;

// ------------------------------------------------------------------------------------------------
