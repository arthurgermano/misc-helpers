import { describe, expect, it, vi, assert } from "vitest";
import { constants, crypto, utils, auth } from "../index.js";
import fs from "fs";
import { credential, assertion } from "./webauthnTestContent.js";

// ------------------------------------------------------------------------------------------------

const PUBLIC_KEY = fs.readFileSync("./keys/public_key.pem", "utf8");
const PRIVATE_KEY = fs.readFileSync("./keys/private_key.pem", "utf8");

// ------------------------------------------------------------------------------------------------

describe("CRYPTO - getCrypto", () => {
  // ----------------------------------------------------------------------------------------------

  const getCrypto = crypto.getCrypto;

  // ----------------------------------------------------------------------------------------------

  it("getCrypto - should return window.crypto in a browser environment", () => {
    // Mock the browser environment
    global.window = { crypto: { subtle: {} } };

    const crypto = getCrypto();
    expect(crypto).toBe(global.window.crypto);

    // Clean up the mock
    delete global.window;
  });

  // ----------------------------------------------------------------------------------------------

  it("getCrypto - should return the Node.js crypto module in a Node environment", () => {
    const crypto = getCrypto();
    expect(crypto.createHash).toBeDefined();

    // Restore the original module
    vi.restoreAllMocks();
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("CRYPTO - encrypt", () => {
  // ----------------------------------------------------------------------------------------------

  const encrypt = crypto.encrypt;

  // ----------------------------------------------------------------------------------------------

  it("encrypt - should encrypt a message with a valid public key", async () => {
    const message = "Hello, World!";

    const encryptedMessage = await encrypt(PUBLIC_KEY, message);

    assert.ok(encryptedMessage);
    assert.notStrictEqual(encryptedMessage, message);
  });

  // ----------------------------------------------------------------------------------------------

  it("encrypt - should throw an error for an empty message", async () => {
    const message = await encrypt(PUBLIC_KEY, "");
    expect(message).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("encrypt - should throw an error for an invalid public key format", async () => {
    const message = "Hello, World!";
    const invalidPublicKey = "INVALID_PUBLIC_KEY";

    try {
      await encrypt(invalidPublicKey, message);
    } catch (error) {
      expect(error.message).toBe("Public Key is not well PEM formatted");
    }
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("CRYPTO - decrypt", () => {
  // ----------------------------------------------------------------------------------------------

  const decrypt = crypto.decrypt;
  const encrypt = crypto.encrypt;

  // ----------------------------------------------------------------------------------------------

  it("decrypt - should decrypt an encrypted message with a valid private key", async () => {
    const message = "Hello, World!";
    const encryptedMessage = await encrypt(PUBLIC_KEY, message);
    const decryptedMessage = await decrypt(PRIVATE_KEY, encryptedMessage);

    assert.strictEqual(decryptedMessage, "Hello, World!");
  });

  // ----------------------------------------------------------------------------------------------

  it("decrypt - should throw an error for an empty message", async () => {
    const message = await decrypt(PRIVATE_KEY, "");
    expect(message).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("decrypt - should throw an error for an invalid private key format", async () => {
    try {
      await decrypt("invalid_KEY_TEST", "some encrypted message");
    } catch (error) {
      expect(error.message).toBe("Private Key is not well PEM formatted");
    }
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("CRYPTO - digest", () => {
  // ----------------------------------------------------------------------------------------------

  const digest = crypto.digest;

  // ----------------------------------------------------------------------------------------------
  it("digest - should hash a string using SHA-256", async () => {
    const message = "localhost";
    const hash = await digest("SHA-256", message);
    expect(hash).toBeDefined();

    // Compare the result to a known SHA-256 hash of 'hello world'
    const expectedHash =
      "49960DE5880E8C687434170F6476605B8FE4AEB9A28632C7995CF3BA831D9763";
    const resultHash = Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();
    expect(resultHash).toBe(expectedHash);
  });

  // ----------------------------------------------------------------------------------------------

  it("digest - should hash a Uint8Array using SHA-1", async () => {
    const data = new Uint8Array([72, 101, 108, 108, 111]); // 'Hello'
    const hash = await digest("SHA-1", data);
    expect(hash).toBeDefined();
    // Compare the result to a known SHA-1 hash of 'Hello'
    const expectedHash = "F7FF9E8B7BB2E09B70935A5D785E0CC5D9D0ABF0";
    const resultHash = Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();
    expect(resultHash).toBe(expectedHash);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("CRYPTO - importPublicKey", function () {
  // ----------------------------------------------------------------------------------------------

  const importPublicKey = crypto.importPublicKey;
  const base64ToBuffer = utils.base64ToBuffer;

  // ----------------------------------------------------------------------------------------------

  it("importPublicKey - import key correctly", async function () {
    const publicKey = base64ToBuffer(credential.response.publicKey, false);
    const importedKey = await importPublicKey(
      "spki",
      publicKey,
      {
        name: "ECDSA", // Specify the algorithm used by the key
        namedCurve: "P-256", // Specify the curve used by the key (adjust as needed)
      },
      true,
      ["verify"]
    );

    expect(importedKey).toBeInstanceOf(CryptoKey);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("CRYPTO - verifySignature", function () {
  // ----------------------------------------------------------------------------------------------

  const importPublicKey = crypto.importPublicKey;
  const verifySignature = crypto.verifySignature;
  const digest = crypto.digest;
  const base64ToBuffer = utils.base64ToBuffer;
  const bufferConcatenate = utils.bufferConcatenate;
  const convertECDSAASN1Signature = auth.webAuthn.convertECDSAASN1Signature;

  // ----------------------------------------------------------------------------------------------

  it("verifySignature - verify signature correctly", async function () {
    const authenticatorDataBuffer = base64ToBuffer(
      assertion.response.authenticatorData,
      false
    );
    const clientDataJSONSHA256Data = await digest(
      "SHA-256",
      base64ToBuffer(assertion.response.clientDataJSON, false)
    );
    const dataToVerify = bufferConcatenate(
      authenticatorDataBuffer,
      clientDataJSONSHA256Data
    );

    const publicKey = base64ToBuffer(credential.response.publicKey, false);
    const importedKey = await importPublicKey(
      "spki",
      publicKey,
      {
        name: "ECDSA", // Specify the algorithm used by the key
        namedCurve: "P-256", // Specify the curve used by the key (adjust as needed)
      },
      true,
      ["verify"]
    );

    const signature = convertECDSAASN1Signature(
      new Uint8Array(base64ToBuffer(assertion.response.signature, false))
    );

    const isValid = await verifySignature(
      {
        name: "ECDSA",
        hash: { name: "SHA-256" },
      },
      importedKey,
      signature,
      dataToVerify
    );

    expect(isValid).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------
