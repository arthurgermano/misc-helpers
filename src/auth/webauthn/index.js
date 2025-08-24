import convertECDSAASN1Signature from "./convertECDSAASN1Signature.js";
import getAuthenticationAuthData from "./getAuthenticationAuthData.js";
import getRegistrationAuthData from "./getRegistrationAuthData.js";
import getWebAuthnAuthenticationAssertion from "./getWebAuthnAuthenticationAssertion.js";
import getWebAuthnRegistrationCredential from "./getWebAuthnRegistrationCredential.js";
import validateRPID from "./validateRPID.js";
import validateAuthentication from "./validateAuthentication.js";
import validateRegistration from "./validateRegistration.js";

// Named exports para importação individual
export { 
  convertECDSAASN1Signature,
  getAuthenticationAuthData,
  getRegistrationAuthData,
  getWebAuthnAuthenticationAssertion,
  getWebAuthnRegistrationCredential,
  validateRPID,
  validateAuthentication,
  validateRegistration
};

// Default export para compatibilidade
export default {
  convertECDSAASN1Signature,
  getAuthenticationAuthData,
  getRegistrationAuthData,
  getWebAuthnAuthenticationAssertion,
  getWebAuthnRegistrationCredential,
  validateRPID,
  validateAuthentication,
  validateRegistration,
};