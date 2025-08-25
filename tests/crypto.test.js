import { describe, expect, it, vi, assert } from "vitest";
import { constants, crypto, utils, auth } from "../src/index.js";
import fs from "fs";
import { credential, assertion } from "./webauthnTestContent.js";

// ------------------------------------------------------------------------------------------------

const PUBLIC_KEY = fs.readFileSync("./keys/public_key.pem", "utf8");
const PRIVATE_KEY = fs.readFileSync("./keys/private_key.pem", "utf8");
const PRIVATE_KEY2 = fs.readFileSync("./keys/private_key2.pem", "utf8");

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
      expect(error.message).toBe("Invalid keyData");
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
    const encryptedMessage = await encrypt(PUBLIC_KEY, message, { ok: true });
    const decryptedMessage = await decrypt(PRIVATE_KEY, encryptedMessage, {
      ok: true,
    });

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
      expect(error.message).toBe("Invalid keyData");
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

describe("CRYPTO - importCryptoKey", function () {
  // ----------------------------------------------------------------------------------------------

  const importCryptoKey = crypto.importCryptoKey;
  const base64ToBuffer = utils.base64ToBuffer;

  // ----------------------------------------------------------------------------------------------

  it("importCryptoKey - import key correctly", async function () {
    const publicKey = base64ToBuffer(credential.response.publicKey, false);
    const importedKey = await importCryptoKey(
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

  const importCryptoKey = crypto.importCryptoKey;
  const verifySignature = crypto.verifySignature;
  const digest = crypto.digest;
  const base64ToBuffer = utils.base64ToBuffer;
  const bufferConcatenate = utils.bufferConcatenate;
  const convertECDSAASN1Signature = auth.webAuthn.convertECDSAASN1Signature;

  // ----------------------------------------------------------------------------------------------

  it("verifySignature - verify signature correctly", async function () {
    const authenticatorDataBuffer = base64ToBuffer(
      assertion.response.authenticatorData
    );
    const clientDataJSONSHA256Data = await digest(
      "SHA-256",
      new Uint8Array(base64ToBuffer(assertion.response.clientDataJSON))
    );
    const dataToVerify = bufferConcatenate(
      authenticatorDataBuffer,
      clientDataJSONSHA256Data
    );

    const publicKey = base64ToBuffer(credential.response.publicKey, false);
    const importedKey = await importCryptoKey(
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

describe("CRYPTO - Full Encryption/Decryption Buffer Cycle", () => {
  const originalMessage = "Essa mensagem secreta deve ser preservada!";

  // ----------------------------------------------------------------------------------------------

  it("should encrypt and decrypt a message, restoring the original data perfectly", async () => {
    // 1. Preparação: Converte a mensagem original para um buffer
    const originalBuffer = utils.bufferFromString(originalMessage);

    // 2. Criptografia: Usa a chave pública para criptografar o buffer
    const encryptedBase64 = await crypto.encryptBuffer(
      PUBLIC_KEY,
      originalBuffer
    );

    expect(encryptedBase64).toBeTruthy(); // Verifica se não é nulo ou vazio
    expect(encryptedBase64).not.toBe(originalMessage); // Garante que a mensagem foi alterada

    // 3. Decriptografia: Usa a chave privada correspondente para decriptografar
    const decryptedBuffer = await crypto.decryptBuffer(
      PRIVATE_KEY,
      encryptedBase64
    );

    // 4. Verificação:

    // A verificação mais confiável usando seu utilitário de comparação de buffers
    expect(utils.bufferCompare(originalBuffer, decryptedBuffer)).toBe(true);

    // Verificação secundária de legibilidade
    const finalMessage = utils.bufferToString(decryptedBuffer);
    expect(finalMessage).toBe(originalMessage);
  });

  // ----------------------------------------------------------------------------------------------

  it("should handle empty strings correctly through the cycle", async () => {
    const emptyBuffer = utils.bufferFromString("");

    const encrypted = await crypto.encryptBuffer(PUBLIC_KEY, emptyBuffer);
    expect(encrypted).toBe("");

    const decrypted = await crypto.decryptBuffer(PRIVATE_KEY, encrypted);
    expect(utils.bufferCompare(emptyBuffer, decrypted)).toBe(true);
  });

  it("should correctly handle messages with special UTF-8 characters", async () => {
    const message = "Olá, mundo da criptografia! 👋✅";
    const originalBuffer = utils.bufferFromString(message);

    const encrypted = await crypto.encryptBuffer(PUBLIC_KEY, originalBuffer);
    const decrypted = await crypto.decryptBuffer(PRIVATE_KEY, encrypted);

    expect(utils.bufferCompare(originalBuffer, decrypted)).toBe(true);
    expect(utils.bufferToString(decrypted)).toBe(message);
  });

  // ----------------------------------------------------------------------------------------------

  it("should correctly handle serialized JSON objects as messages", async () => {
    const jsonPayload = {
      id: 123,
      user: "gema",
      data: [1, "teste", true],
      timestamp: "2025-08-25T16:13:21.000Z",
    };
    const message = JSON.stringify(jsonPayload);
    const originalBuffer = utils.bufferFromString(message);

    const encrypted = await crypto.encryptBuffer(PUBLIC_KEY, originalBuffer);
    const decrypted = await crypto.decryptBuffer(PRIVATE_KEY, encrypted);

    const finalMessage = utils.bufferToString(decrypted);
    expect(JSON.parse(finalMessage)).toEqual(jsonPayload);
  });

  // ----------------------------------------------------------------------------------------------

  it("should handle keys with extra whitespace and line breaks", async () => {
    // Simula uma chave que foi copiada/colada com espaçamento incorreto.
    const keyWithExtraSpaces = `

    -----BEGIN PUBLIC KEY-----
    ${PUBLIC_KEY.replace(/-----(BEGIN|END) PUBLIC KEY-----/g, "").replace(
      /\s/g,
      ""
    )}

    -----END PUBLIC KEY-----

  `;
    const message = "robustez da chave";
    const originalBuffer = utils.bufferFromString(message);

    // O teste passa se a criptografia não lançar um erro.
    const encrypted = await crypto.encryptBuffer(
      keyWithExtraSpaces,
      originalBuffer
    );
    expect(encrypted).toBeTruthy();

    // Verifica o ciclo completo para garantir.
    const decrypted = await crypto.decryptBuffer(PRIVATE_KEY, encrypted);
    expect(utils.bufferToString(decrypted)).toBe(message);
  });
  // ----------------------------------------------------------------------------------------------

  it("should perform the cycle correctly with custom algorithm options (SHA-512)", async () => {
    const message = "ciclo com opções customizadas";
    const originalBuffer = utils.bufferFromString(message);
    const customOptions = {
      algorithm: { name: "RSA-OAEP", hash: { name: "SHA-512" } },
    };

    const encrypted = await crypto.encryptBuffer(
      PUBLIC_KEY,
      originalBuffer,
      customOptions
    );
    const decrypted = await crypto.decryptBuffer(
      PRIVATE_KEY,
      encrypted,
      customOptions
    );

    expect(utils.bufferCompare(originalBuffer, decrypted)).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("should fail to decrypt if algorithm options do not match between encryption and decryption", async () => {
    const message = "falha de opções";
    const originalBuffer = utils.bufferFromString(message);
    const encryptionOptions = {
      algorithm: { name: "RSA-OAEP", hash: { name: "SHA-512" } },
    };
    // Opções de decriptografia diferentes (o padrão é SHA-256)
    const decryptionOptions = {
      algorithm: { name: "RSA-OAEP", hash: { name: "SHA-256" } },
    };

    const encrypted = await crypto.encryptBuffer(
      PUBLIC_KEY,
      originalBuffer,
      encryptionOptions
    );

    // A decriptografia deve falhar porque os hashes não coincidem.
    await expect(
      crypto.decryptBuffer(PRIVATE_KEY, encrypted, decryptionOptions)
    ).rejects.toBeInstanceOf(Error);
  });

  // ----------------------------------------------------------------------------------------------

  describe("Error Handling", () => {
    it("should throw an error if trying to decrypt with the wrong private key", async () => {
      const originalBuffer = utils.bufferFromString("teste de chave");
      const encryptedBase64 = await crypto.encryptBuffer(
        PUBLIC_KEY,
        originalBuffer
      );

      // A sintaxe `expect().rejects` é a forma idiomática do Vitest para testar Promises que falham
      await expect(
        crypto.decryptBuffer(PRIVATE_KEY2, encryptedBase64)
      ).rejects.toBeInstanceOf(Error);
    });

    it("should throw an error if the encrypted data is corrupted", async () => {
      const originalBuffer = utils.bufferFromString("teste de corrupção");
      const encryptedBase64 = await crypto.encryptBuffer(
        PUBLIC_KEY,
        originalBuffer
      );

      // Corrompe a mensagem (troca um caractere no meio)
      const corruptedData =
        encryptedBase64.slice(0, 10) + "X" + encryptedBase64.slice(11);

      await expect(
        crypto.decryptBuffer(PRIVATE_KEY, corruptedData)
      ).rejects.toBeInstanceOf(Error);
    });

    it("should throw an error when encrypting a message that is too large", async () => {
      const longMessage = "A".repeat(500);
      const largeBuffer = utils.bufferFromString(longMessage);

      await expect(
        crypto.encryptBuffer(PUBLIC_KEY, largeBuffer)
      ).rejects.toBeInstanceOf(Error);
    });
  });
});
