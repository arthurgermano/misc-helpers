const cbor = require("cbor-x");
const base64FromBuffer = require("../../utils/base64FromBuffer");

// ------------------------------------------------------------------------------------------------

/**
 * Retrieves registration authentication data from a WebAuthn credential.
 *
 * @function getRegistrationAuthData
 * @param {PublicKeyCredential} credential - The WebAuthn credential object.
 * @returns {Object} An object containing registration authentication data extracted from the credential.
 *
 * @example
 * // Example usage
 * const credential = ...; // Obtain the WebAuthn credential object
 * const registrationAuthData = getRegistrationAuthData(credential);
 * console.log('Registration Authentication Data:', registrationAuthData);
 */
function getRegistrationAuthData(credential) {
  try {
    const response = credential.response;

    // Access rawId ArrayBuffer
    const rawId = base64FromBuffer(credential.rawId);

    // Access attestationObject ArrayBuffer
    const attestationObject = base64FromBuffer(response.attestationObject);
    const authData = parseAuthData(response.attestationObject);

    // Access client JSON
    const clientDataJSONDecoded = new TextDecoder().decode(
      response.clientDataJSON
    );
    const clientDataJSON = base64FromBuffer(response.clientDataJSON);

    // Return authenticator data ArrayBuffer
    const authenticatorData = base64FromBuffer(response.getAuthenticatorData());

    // Return public key ArrayBuffer
    const publicKey = base64FromBuffer(response.getPublicKey());

    return {
      credential: {
        rawId,
        id: credential.id,
        type: credential.type,
        authenticatorAttachment: credential.authenticatorAttachment,
        clientExtensionResults: credential.getClientExtensionResults(),
      },
      authData,
      response: {
        attestationObject,
        authenticatorData,
        clientDataJSONDecoded,
        clientDataJSON,
        transports: response.getTransports() || [],
        publicKeyAlgorithm: response.getPublicKeyAlgorithm(),
      },
    };
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

function parseAuthData(resAttObj) {
  const attestationObject = cbor.decode(new Uint8Array(resAttObj));
  const { authData } = attestationObject;

  // get the length of the credential ID
  const dataView = new DataView(new ArrayBuffer(2));
  const idLenBytes = authData.slice(53, 55);
  idLenBytes.forEach((value, index) => dataView.setUint8(index, value));
  const credentialIdLength = dataView.getUint16();

  // get the credential ID
  const credentialId = authData.slice(55, 55 + credentialIdLength);

  // get the public key object
  const publicKeyBytes = authData.slice(55 + credentialIdLength);

  const publicKeyObject = base64FromBuffer(publicKeyBytes.buffer);

  return {
    credentialId: base64FromBuffer(credentialId),
    publicKeyObject,
  };
}

// ------------------------------------------------------------------------------------------------

module.exports = getRegistrationAuthData;

// ------------------------------------------------------------------------------------------------
