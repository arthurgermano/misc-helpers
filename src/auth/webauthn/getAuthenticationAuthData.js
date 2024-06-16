const base64FromBuffer = require("../../utils/base64FromBuffer");

// ------------------------------------------------------------------------------------------------

/**
 * Extracts data from a WebAuthn authentication assertion object.
 *
 * @function getAuthenticationAuthData
 * @param {Object} assertion - The WebAuthn authentication assertion object.
 * @returns {Object} An object containing extracted data from the authentication assertion.
 *
 * @throws {Error} Throws an error if extraction fails due to missing or invalid data.
 *  *
 * const extractedData = getAuthenticationAuthData(assertion);
 * console.log('Extracted Data:', extractedData);
 */
function getAuthenticationAuthData(assertion) {
  try {
    const id = assertion.id;

    // rawId ArrayBuffer
    const rawId = base64FromBuffer(assertion.rawId);

    // Assertion type
    const type = assertion.type;

    // Response object to be returned
    const response = {};

    // Access client JSON
    response.clientDataJSONDecoded = new TextDecoder().decode(
      assertion.response.clientDataJSON
    );
    response.clientDataJSON = base64FromBuffer(
      assertion.response.clientDataJSON
    );

    // Access authenticator data ArrayBuffer
    response.authenticatorData = base64FromBuffer(
      assertion.response.authenticatorData
    );

    const authData = getAuthDataFromAuthentication(
      assertion.response.authenticatorData
    );

    // Access signature ArrayBuffer
    response.signature = base64FromBuffer(assertion.response.signature);

    // Access user handle if present
    response.userHandle = assertion.response.userHandle
      ? base64FromBuffer(assertion.response.userHandle)
      : false;

    return {
      id,
      rawId,
      type,
      authData,
      response,
    };
  } catch (error) {
    handleError(error);
  }
}

// ------------------------------------------------------------------------------------------------

function getAuthDataFromAuthentication(authData) {
  try {
    if (!authData || authData.byteLength < 37) {
      throw new Error(
        `Authenticator data was ${
          authData?.byteLength || "invalid"
        } bytes, expected at least 37 bytes`
      );
    }

    const dataView = new DataView(
      authData,
      authData.byteOffset,
      authData.length
    );

    /**
     * authData distribution data
     * RPIDHash - 32 bytes
     * Flags - 1 byte
     * Counter - 4 bytes
     * AttestedCredentialData
     * - AAGUID - 16 bytes
     * - CredentialID Length - 2 bytes
     * - CredentialID - n bytes
     * - COSEPublicKey - 77 bytes
     */
    let pointer = 0;
    const rpIdHash = authData.slice(pointer, (pointer += 32));
    const flagsBuf = authData.slice(pointer, (pointer += 1));
    const flagsInt = new Uint8Array(flagsBuf)[0];

    const flags = {
      up: !!(flagsInt & (1 << 0)), // User Presence
      uv: !!(flagsInt & (1 << 2)), // User Verified
      be: !!(flagsInt & (1 << 3)), // Backup Eligibility
      bs: !!(flagsInt & (1 << 4)), // Backup State
      at: !!(flagsInt & (1 << 6)), // Attested Credential Data Present
      ed: !!(flagsInt & (1 << 7)), // Extension Data Present
      flagsInt,
    };

    const counterBuf = authData.slice(pointer, pointer + 4);
    const counter = dataView.getUint32(pointer, false);

    pointer += 4;

    const { aaguid, credentialId, credentialPublicKey } = getAttestationObject(
      flags,
      authData,
      pointer,
      dataView
    );

    const extensionsData = getExtensionData(flags, authData, pointer);

    // Pointer should be at the end of the authenticator data, otherwise too much data was sent
    if (authData.byteLength > pointer) {
      throw new Error(
        "Leftover bytes detected while parsing authenticator data"
      );
    }

    return {
      rpIdHash: base64FromBuffer(rpIdHash),
      flagsBuf: base64FromBuffer(flagsBuf),
      flags,
      counter,
      counterBuf: base64FromBuffer(counterBuf),
      aaguid,
      credentialId: base64FromBuffer(credentialId),
      credentialPublicKey: base64FromBuffer(credentialPublicKey),
      extensionsData,
    };
  } catch (error) {
    handleError(error);
  }
}

// ------------------------------------------------------------------------------------------------

function getAttestationObject(flags, authData, pointer, dataView) {
  let aaguid = undefined;
  let credentialId = undefined;
  let credentialPublicKey = undefined;
  if (!flags.at) {
    return {
      aaguid,
      credentialId,
      credentialPublicKey,
    };
  }
  
  aaguid = authData.slice(pointer, (pointer += 16));

  const credIDLen = dataView.getUint16(pointer);
  pointer += 2;

  credentialId = authData.slice(pointer, (pointer += credIDLen));
  credentialPublicKey = authData.slice(pointer, (pointer += 77));

  return {
    aaguid,
    credentialId,
    credentialPublicKey,
  };
}

// ------------------------------------------------------------------------------------------------

function getExtensionData(flags = {}, authData, pointer) {
  let extensionsData = undefined;
  if (!flags.ed) {
    return extensionsData;
  }

  extensionsData = authData.slice(pointer);
  pointer += extensionsDataBuffer.byteLength;
  return extensionsData;
}

// ------------------------------------------------------------------------------------------------

module.exports = getAuthenticationAuthData;

// ------------------------------------------------------------------------------------------------
