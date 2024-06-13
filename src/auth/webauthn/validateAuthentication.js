const validateRPID = require("./validateRPID");
const isNumber = require("../../helpers/isNumber");

// ------------------------------------------------------------------------------------------------

function validateAuthentication(
  expectedProps = {},
  credential,
  assertion,
  counterCredential = -1,
  counterAssertion = -1
) {}

// ------------------------------------------------------------------------------------------------

function validateCounters(counterCredential, counterAssertion) {
  if (!isNumber(counterCredential) || counterCredential < 0) {
    throw new Error(
      "counterCredential must be a number greater than or equal to zero"
    );
  }

  if (!isNumber(counterAssertion) || counterAssertion < 0) {
    throw new Error(
      "counterAssertion must be a number greater than or equal to zero"
    );
  }

  if (counterCredential <= counterAssertion) {
    throw new Error("counterCredential must be greater than counterAssertion");
  }
  return true;
}

// ------------------------------------------------------------------------------------------------

module.exports = validateAuthentication;

// ------------------------------------------------------------------------------------------------
