const base64ToBuffer = require("../../utils/base64ToBuffer");
const bufferCompare = require("../../utils/bufferCompare");
const bufferFromString = require("../../utils/bufferFromString");
const getCrypto = require("../../crypto/getCrypto.js");

// ------------------------------------------------------------------------------------------------
/**
 * Asynchronously validates that the originalRPID matches the verifyRPID after hashing.
 *
 * @param {string} originalRPID - The original RPID to be validated.
 * @param {string} verifyRPID - The base64-encoded RPID to verify against the original.
 * @returns {Promise<boolean>} Returns a promise that resolves to true if the RPIDs match, otherwise it throws an error.
 * @throws {Error} Throws an error if the originalRPID is not provided or if the RPIDs do not match.
 */
async function validateRPID(originalRPID, verifyRPID, algorithm = "SHA-256") {
  try {
    if (!originalRPID) {
      throw new Error("originalRPID is required");
    }
    if (!verifyRPID) {
      throw new Error("verifyRPID is required");
    }

    const crypto = getCrypto();
    const originalRPIDDigest = await crypto.subtle.digest(
      algorithm,
      bufferFromString(originalRPID)
    );

    const verifyRPIDBuffer = base64ToBuffer(verifyRPID);
    const verifyRPIDDigest = verifyRPIDBuffer.slice(0, 32);

    if (!bufferCompare(originalRPIDDigest, verifyRPIDDigest)) {
      throw new Error(
        `Registration RPID does not match the authentication RPID.`
      );
    }
    return true;
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

module.exports = validateRPID;

// ------------------------------------------------------------------------------------------------
