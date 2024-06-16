module.exports = {
  convertECDSAASN1Signature: require("./convertECDSAASN1Signature"),
  getAuthenticationAuthData: require("./getAuthenticationAuthData"),
  getRegistrationAuthData: require("./getRegistrationAuthData"),
  getWebAuthnAuthenticationAssertion: require("./getWebAuthnAuthenticationAssertion"),
  getWebAuthnRegistrationCredential: require("./getWebAuthnRegistrationCredential"),
  validateRPID: require("./validateRPID"),
  validateAuthentication: require("./validateAuthentication"),
  validateRegistration: require("./validateRegistration"),
};
