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
    let originalRPIDDigest;
    if (typeof window !== "undefined") {
      originalRPIDDigest = await crypto.subtle.digest(
        algorithm,
        bufferFromString(originalRPID)
      );
    } else {
      const hash = crypto.createHash(getAlgorithm(algorithm));
      hash.update(bufferFromString(originalRPID));
      originalRPIDDigest = hash.digest();
    }

    const verifyRPIDBuffer = base64ToBuffer(verifyRPID, false);
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

function getAlgorithm(algorithm = "SHA-256") {
  algorithm = algorithm.toLocaleLowerCase();
  algorithm = algorithm.replace("-", "");
  return algorithm;
}

module.exports = validateRPID;

// ------------------------------------------------------------------------------------------------
