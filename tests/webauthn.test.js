import { describe, expect, it, vi, assert } from "vitest";
import { constants, auth, utils } from "../index.js";
import { credential, assertion } from "./webauthnTestContent.js";

// ------------------------------------------------------------------------------------------------

describe("WEBAUTHN - validateRPID", () => {
  // ----------------------------------------------------------------------------------------------

  const validateRPID = auth.webAuthn.validateRPID;

  // ----------------------------------------------------------------------------------------------

  it("validateRPID - should throw an error if originalRPID is not provided", async () => {
    await expect(validateRPID(null, "verifyRPID")).rejects.toThrow(
      "originalRPID is required"
    );
  });

  // ----------------------------------------------------------------------------------------------

  it("validateRPID - should return true if RPIDs match", async () => {
    const originalRPID = "localhost";
    const verifyRPID = assertion.response.authenticatorData;
    let result;
    try {
      result = await validateRPID(originalRPID, verifyRPID);
    } catch (error) {
      result = error.message;
    }
    expect(result).toEqual(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateRPID - should throw an error if RPIDs do not match", async () => {
    const originalRPID = "example.com";
    const verifyRPID = assertion.response.authenticatorData;
    try {
      await validateRPID(originalRPID, verifyRPID);
    } catch (error) {
      expect(error.message).toEqual(
        "Registration RPID does not match the authentication RPID."
      );
    }
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("WEBAUTHN - convertECDSAASN1Signature", function () {
  // ----------------------------------------------------------------------------------------------

  const convertECDSAASN1Signature = auth.webAuthn.convertECDSAASN1Signature;
  const base64ToBuffer = utils.base64ToBuffer;
  const bufferCompare = utils.bufferCompare;
  // const base64FromBuffer = utils.base64FromBuffer;

  // ----------------------------------------------------------------------------------------------
  it("convertECDSAASN1Signature - should correctly convert valid ASN.1 sequence", function () {
    const signature = new Uint8Array(
      base64ToBuffer(assertion.response.signature)
    );
    const result = convertECDSAASN1Signature(signature);
    // console.log(">>>",base64FromBuffer(result))
    const expected = base64ToBuffer(
      "FWrHmenAvMcvjScDNXqVGeZaiWBusaccoMbUO/bzKuQiwHvU8By2ecnfJniFKjW+2clKm5C0bAyqOeYtwbYYOg"
    );
    expect(bufferCompare(result, expected)).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("convertECDSAASN1Signature - should throw error for invalid ASN.1 sequence (wrong element count)", function () {
    const input = Buffer.from(
      "3024020101042048d266e8f4aeb96705757f98dd8f1991d4d1b1e8344e1f953518e46cc2ac5c12a1448c8f5b8b27a9",
      "hex"
    );

    assert.throws(() => {
      convertECDSAASN1Signature(input);
    }, "Expected ASN.1 sequence element to be an INTEGER");
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("WEBAUTHN - validateAuthentication", function () {
  // ----------------------------------------------------------------------------------------------

  const validateAuthentication = auth.webAuthn.validateAuthentication;

  // ----------------------------------------------------------------------------------------------
  it("validateAuthentication - should validate authentication correctly", async function () {
    // console.log(credential)
    const isValid = await validateAuthentication(
      credential,
      assertion,
      {
        rpID: "localhost",
        counterCredential: 1,
        challenge: "8OiCl8P3Afyp0fmub8schjUWNz7y0n7b",
        origin: "https://localhost:3000",
        type: "webauthn.get",
      },
      {
        counterAssertion: 0,
      },
      {}
    );
    expect(isValid).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("WEBAUTHN - validateRegistration", function () {
  // ----------------------------------------------------------------------------------------------

  const validateRegistration = auth.webAuthn.validateRegistration;

  // ----------------------------------------------------------------------------------------------
  it("validateRegistration - should validate authentication correctly", function () {
    // console.log(credential)
    const isValid = validateRegistration(
      credential,
      {
        challenge: "Ty1idXZna1d3ckw1RXJzUVdfbHpJZ1RWT3VIc1NielI",
        origin: "https://localhost:3000",
        type: "webauthn.create",
      },
    );
    expect(isValid).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------
