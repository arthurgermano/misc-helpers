const validateRPID = require("./validateRPID");
const isNumber = require("../../helpers/isNumber");

// ------------------------------------------------------------------------------------------------

function validateAuthentication(
  credential,
  assertion,
  expectedProps = {},
  incomingProps = {}
) {
  validateCounters(expectedProps, incomingProps);
  validateFlags(assertion.authData.flags);

  // // Ensure credential specified an ID
  // if (!id) {
  //   throw new Error('Missing credential ID');
  // }

  // // Ensure ID is base64url-encoded
  // if (id !== rawId) {
  //   throw new Error('Credential ID was not base64url-encoded');
  // }

  // // Make sure credential type is public-key
  // if (credentialType !== 'public-key') {
  //   throw new Error(
  //     `Unexpected credential type ${credentialType}, expected "public-key"`,
  //   );
  // }

  // if (origin !== expectedOrigin) {
  //   throw new Error(
  //     `Unexpected authentication response origin "${origin}", expected "${expectedOrigin}"`,
  //   );
  // }
}

// ------------------------------------------------------------------------------------------------

function validateCounters(expectedProps, incomingProps) {
  if (!isNumber(expectedProps.counterCredential) || expectedProps.counterCredential < 0) {
    throw new Error(
      "counterCredential must be a number greater than or equal to zero"
    );
  }

  if (!isNumber(incomingProps.counterAssertion) || incomingProps.counterAssertion < 0) {
    throw new Error(
      "counterAssertion must be a number greater than or equal to zero"
    );
  }

  if (expectedProps.counterCredential <= incomingProps.counterAssertion) {
    throw new Error("counterCredential must be greater than counterAssertion");
  }
  return true;
}

// ------------------------------------------------------------------------------------------------

function validateFlags(flags) {
  if (!flags.up) {
    throw new Error(`User Present is required for authentication.`);
  }

  if (!flags.uv) {
    throw new Error(`User Verified is required for authentication.`);
  }
}

// ------------------------------------------------------------------------------------------------

module.exports = validateAuthentication;

// ------------------------------------------------------------------------------------------------
