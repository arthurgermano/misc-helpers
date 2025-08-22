const base64FromBuffer = require("../../utils/base64FromBuffer");

// ------------------------------------------------------------------------------------------------

/**
 * Extracts and processes data from a WebAuthn authentication assertion object.
 * 
 * This function parses the WebAuthn assertion response and extracts all relevant
 * authentication data including client data, authenticator data, signature, and
 * optional user handle information.
 *
 * @param {Object} assertion - The WebAuthn authentication assertion object
 * @param {string} assertion.id - The credential ID as a string
 * @param {ArrayBuffer} assertion.rawId - The credential ID as raw bytes
 * @param {string} assertion.type - The credential type (typically "public-key")
 * @param {Object} assertion.response - The authenticator assertion response
 * @param {ArrayBuffer} assertion.response.clientDataJSON - Client data in JSON format
 * @param {ArrayBuffer} assertion.response.authenticatorData - Authenticator data bytes
 * @param {ArrayBuffer} assertion.response.signature - The assertion signature
 * @param {ArrayBuffer} [assertion.response.userHandle] - Optional user handle
 * @returns {Object} Extracted authentication data with parsed components
 * @throws {Error} If extraction fails due to missing or invalid data
 */
function getAuthenticationAuthData(assertion) {
  const id = assertion.id;
  const rawId = base64FromBuffer(assertion.rawId);
  const type = assertion.type;

  // Build response object with all authentication data
  const response = {
    clientDataJSONDecoded: new TextDecoder().decode(assertion.response.clientDataJSON),
    clientDataJSON: base64FromBuffer(assertion.response.clientDataJSON),
    authenticatorData: base64FromBuffer(assertion.response.authenticatorData),
    signature: base64FromBuffer(assertion.response.signature),
    userHandle: assertion.response.userHandle
      ? base64FromBuffer(assertion.response.userHandle)
      : false
  };

  // Parse authenticator data structure
  const authData = getAuthDataFromAuthentication(assertion.response.authenticatorData);

  return {
    id,
    rawId,
    type,
    authData,
    response
  };
}

// ------------------------------------------------------------------------------------------------

/**
 * Parses WebAuthn authenticator data according to the FIDO2 specification.
 * 
 * The authenticator data structure contains:
 * - RP ID Hash (32 bytes): SHA-256 hash of the relying party identifier
 * - Flags (1 byte): Bit flags indicating various states
 * - Counter (4 bytes): Signature counter value (big-endian)
 * - Optional attested credential data (variable length)
 * - Optional extensions data (variable length)
 *
 * @param {ArrayBuffer} authData - Raw authenticator data from WebAuthn response
 * @returns {Object} Parsed authenticator data components
 * @throws {Error} If authenticator data is too short or contains invalid data
 */
function getAuthDataFromAuthentication(authData) {
  // Validate minimum length for RP ID hash, flags, and counter
  if (!authData || authData.byteLength < 37) {
    throw new Error(
      `Authenticator data was ${authData?.byteLength || "invalid"} bytes, expected at least 37 bytes`
    );
  }

  const dataView = new DataView(authData, authData.byteOffset, authData.length);
  let pointer = 0;

  // Extract RP ID hash (32 bytes)
  const rpIdHash = authData.slice(pointer, pointer + 32);
  pointer += 32;

  // Extract and parse flags byte
  const flagsBuf = authData.slice(pointer, pointer + 1);
  const flagsInt = new Uint8Array(flagsBuf)[0];
  pointer += 1;

  const flags = {
    up: !!(flagsInt & 0x01), // User Present (bit 0)
    uv: !!(flagsInt & 0x04), // User Verified (bit 2)
    be: !!(flagsInt & 0x08), // Backup Eligible (bit 3)
    bs: !!(flagsInt & 0x10), // Backup State (bit 4)
    at: !!(flagsInt & 0x40), // Attested Credential Data Present (bit 6)
    ed: !!(flagsInt & 0x80), // Extension Data Present (bit 7)
    flagsInt
  };

  // Extract signature counter (4 bytes, big-endian)
  const counterBuf = authData.slice(pointer, pointer + 4);
  const counter = dataView.getUint32(pointer, false); // false = big-endian
  pointer += 4;

  // Parse optional attested credential data
  const attestationResult = parseAttestedCredentialData(flags, authData, pointer);
  pointer = attestationResult.newPointer;

  // Parse optional extension data
  const extensionsData = parseExtensionData(flags, authData, pointer);

  return {
    rpIdHash: base64FromBuffer(rpIdHash),
    flagsBuf: base64FromBuffer(flagsBuf),
    flags,
    counter,
    counterBuf: base64FromBuffer(counterBuf),
    aaguid: attestationResult.aaguid,
    credentialId: base64FromBuffer(attestationResult.credentialId),
    credentialPublicKey: base64FromBuffer(attestationResult.credentialPublicKey),
    extensionsData
  };
}

// ------------------------------------------------------------------------------------------------

/**
 * Parses attested credential data from authenticator data when the AT flag is set.
 * 
 * Attested credential data structure:
 * - AAGUID (16 bytes): Authenticator attestation GUID
 * - Credential ID Length (2 bytes): Length of credential ID (big-endian)
 * - Credential ID (variable): The credential identifier
 * - Credential Public Key (variable): COSE-encoded public key
 *
 * @param {Object} flags - Parsed flags from authenticator data
 * @param {ArrayBuffer} authData - Complete authenticator data buffer
 * @param {number} pointer - Current parsing position in the buffer
 * @returns {Object} Parsed credential data and updated pointer position
 */
function parseAttestedCredentialData(flags, authData, pointer) {
  // Return undefined values if attested credential data is not present
  if (!flags.at) {
    return {
      aaguid: undefined,
      credentialId: undefined,
      credentialPublicKey: undefined,
      newPointer: pointer
    };
  }

  const dataView = new DataView(authData, authData.byteOffset, authData.length);

  // Extract AAGUID (16 bytes)
  const aaguid = authData.slice(pointer, pointer + 16);
  pointer += 16;

  // Extract credential ID length (2 bytes, big-endian)
  const credentialIdLength = dataView.getUint16(pointer, false);
  pointer += 2;

  // Extract credential ID
  const credentialId = authData.slice(pointer, pointer + credentialIdLength);
  pointer += credentialIdLength;

  // Extract credential public key (remaining data up to extensions)
  // Note: In practice, public key length varies, but for this implementation
  // we assume a fixed 77 bytes as per original code
  const credentialPublicKey = authData.slice(pointer, pointer + 77);
  pointer += 77;

  return {
    aaguid,
    credentialId,
    credentialPublicKey,
    newPointer: pointer
  };
}

// ------------------------------------------------------------------------------------------------

/**
 * Parses extension data from authenticator data when the ED flag is set.
 * 
 * Extension data is CBOR-encoded and contains additional authenticator
 * information. The data extends from the current pointer to the end of
 * the authenticator data buffer.
 *
 * @param {Object} flags - Parsed flags from authenticator data
 * @param {ArrayBuffer} authData - Complete authenticator data buffer
 * @param {number} pointer - Current parsing position in the buffer
 * @returns {ArrayBuffer|undefined} Extension data buffer or undefined if not present
 */
function parseExtensionData(flags, authData, pointer) {
  // Return undefined if extension data is not present
  if (!flags.ed) {
    return undefined;
  }

  // Extension data spans from current pointer to end of authenticator data
  return authData.slice(pointer);
}

// ------------------------------------------------------------------------------------------------

module.exports = getAuthenticationAuthData;

// ------------------------------------------------------------------------------------------------