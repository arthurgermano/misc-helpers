/**
 * Initiates the WebAuthn registration process and returns a credential.
 * @param {Object} props - The PublicKeyCredentialCreationOptions object containing the options for creating a new credential.
 * @param {Function} [callback] - Optional callback function to be called with the created credential.
 * @returns {Promise<PublicKeyCredential|string>} A Promise that resolves to the created PublicKeyCredential or a message indicating that WebAuthn is not supported.
 * @throws {Error} If there is an error during the registration process.
 */
async function getWebAuthnRegistrationCredential(props = {}, callback) {
  try {
    if (
      !navigator ||
      !navigator.credentials ||
      !navigator.credentials.create ||
      !navigator.credentials.get
    ) {
      return "WebAuthn not supported";
    }

    validatePropParams(props);

    const credential = await navigator.credentials.create({
      publicKey: props,
    });
    if (callback && typeof callback === "function") {
      return callback(credential);
    }

    return credential;
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

function validatePropParams(props) {
  if (!props.challenge) {
    throw new Error("No challenge provided");
  }
  if (!props.rp) {
    throw new Error("No RP(Relieable Party) provided");
  }
  if (!props.rp.name) {
    throw new Error("No RP(Relieable Party) name provided");
  }
  if (!props.user) {
    throw new Error("No user provided");
  }
  if (!props.user.id) {
    throw new Error("No user id provided");
  }
  if (!props.user.displayName) {
    throw new Error("No user display name provided");
  }
  if (!props.user.name) {
    throw new Error("No user name provided");
  }

  if (
    !props.pubKeyCredParams ||
    !Array.isArray(props.pubKeyCredParams) ||
    !props.pubKeyCredParams.length
  ) {
    throw new Error("No pubKeyCredParams provided");
  }
  for (let pkcp of props.pubKeyCredParams) {
    if (!pkcp.hasOwnProperty("alg")) {
      throw new Error("No pubKeyCredParams.alg provided");
    }
    if (!pkcp.hasOwnProperty("type")) {
      throw new Error("No pubKeyCredParams.type provided");
    }
  }
  return true;
}

// ------------------------------------------------------------------------------------------------

module.exports = getWebAuthnRegistrationCredential;

// ------------------------------------------------------------------------------------------------
