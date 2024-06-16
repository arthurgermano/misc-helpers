const base64ToBuffer = require("../../utils/base64ToBuffer");
const cbor = require("cbor-x");

// ------------------------------------------------------------------------------------------------
/**
 * Validates a WebAuthn registration credential.
 *
 * This function performs a series of validations on the given credential:
 * 1. Validates the basic properties of the credential.
 * 2. Validates the credential against expected request parameters.
 * 3. Extracts and validates the attestation object.
 *
 * @param {Object} credential - The WebAuthn credential to validate.
 * @param {Object} [expectedProps={}] - An object containing expected properties for validation.
 * @param {string} [expectedProps.challenge] - The expected challenge.
 * @param {string} [expectedProps.origin] - The expected origin.
 * @param {string} [expectedProps.type] - The expected type.
 * @returns {Boolean} Boolean true if the credential is valid, otherwise throws an error.
 * @throws {Error} Throws an error if any validation step fails.
 */
function validateRegistration(credential, expectedProps = {}) {
  try {
    validateCredentialProps(credential);
    validateRequestParams(credential, expectedProps);
    extractAndValidateAttestationObject(credential);
    return true;
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------
/**
 * Validates the properties of the credential.
 * 
 * @param {Object} credential - The credential object.
 * 
 * @throws Will throw an error if the credential validation fails.
 * @returns {boolean} Returns true if the credential properties are valid.
 */
function validateCredentialProps(credential) {
  if (!credential) {
    throw new Error("Missing credential");
  }
  if (!credential.id) {
    throw new Error("Missing credential ID");
  }
  if (!credential.rawId) {
    throw new Error("Ḿissing credential rawId");
  }
  if (!credential.type || credential.type != "public-key") {
    throw new Error(
      "Ḿissing credential type or credential type is not public-key"
    );
  }
  return true;
}

// ------------------------------------------------------------------------------------------------

/**
 * Validates the request parameters in the credential against the expected properties.
 * 
 * @param {Object} credential - The credential object.
 * @param {Object} [expectedProps={}] - The expected properties.
 * @param {string} [expectedProps.challenge] - The expected challenge.
 * @param {string} [expectedProps.origin] - The expected origin.
 * @param {string} [expectedProps.type] - The expected type.
 * 
 * @throws Will throw an error if the request parameters validation fails.
 * @returns {boolean} Returns true if the request parameters are valid.
 */
function validateRequestParams(credential, expectedProps = {}) {
  const clientDataJSON = JSON.parse(credential.response.clientDataJSONDecoded);
  if (expectedProps.challenge != clientDataJSON?.challenge) {
    throw new Error(
      `Challenge does not match. Provided challenge: ${
        clientDataJSON?.challenge || "none"
      }.`
    );
  }

  if (expectedProps.origin != clientDataJSON?.origin) {
    throw new Error(
      `Origin does not match. Expected: ${expectedProps.origin} Actual: ${
        clientDataJSON?.origin || "none"
      }`
    );
  }

  if (expectedProps.type != clientDataJSON?.type) {
    throw new Error(
      `Type does not match. Expected: ${expectedProps.type} Actual: ${
        clientDataJSON?.type || "none"
      }`
    );
  }
  return true;
}

// ------------------------------------------------------------------------------------------------
/**
 * Extracts and validates the attestation object from a WebAuthn credential.
 *
 * This function performs the following steps:
 * 1. Converts the Base64-encoded attestation object into a binary buffer.
 * 2. Decodes the buffer into a JavaScript object using CBOR.
 * 3. Validates the attestation object's format and attestation statement.
 *
 * @param {Object} credential - The WebAuthn credential containing the attestation object.
 * @param {Object} credential.response - The response object containing the attestation object.
 * @param {string} credential.response.attestationObject - The Base64-encoded attestation object.
 * @throws {Error} Throws an error if the attestation object format is missing.
 * @throws {Error} Throws an error if the attestation object format is 'none' and the attestation statement is not empty.
 * @throws {Error} Throws an error if the attestation object format is unsupported.
 * @returns {boolean} Returns true if the attestation object is valid.
 */
function extractAndValidateAttestationObject(credential) {
	const attestationObjectBuffer = base64ToBuffer(credential.response.attestationObject, false);
	const attestationObject = cbor.decode(new Uint8Array(attestationObjectBuffer));

	if (!attestationObject.fmt) {
		throw new Error('Missing attestation object format');
	}

	if (attestationObject.fmt === 'none') {
		if (attestationObject.attStmt.size > 0) {
			throw new Error('None attestation had unexpected attestation statement');
		}
	} else {
		throw new Error(`Unsupported Attestation Format: ${attestationObject.fmt}`);
	}

	return true;
}

// ------------------------------------------------------------------------------------------------

module.exports = validateRegistration;

// ------------------------------------------------------------------------------------------------
