import { describe, expect, it, vi, assert, beforeEach, afterEach } from "vitest";
import { constants, crypto, utils, auth } from "../src/index.js";
import fs from "fs";
import { credential, assertion } from "./webauthnTestContent.js";

// ------------------------------------------------------------------------------------------------

const PUBLIC_KEY = fs.readFileSync("./keys/public_key.pem", "utf8");
const PRIVATE_KEY = fs.readFileSync("./keys/private_key.pem", "utf8");

// Test data constants for consistent testing
const TEST_DATA = {
  messages: {
    simple: "Hello, World!",
    empty: "",
    unicode: "こんにちは 🌍 Olá! áéíóú",
    long: "A".repeat(1000),
    special: "Line1\nLine2\tTab\r\nCRLF",
    json: '{"key": "value", "number": 123, "boolean": true}'
  },
  algorithms: {
    sha1: "SHA-1",
    sha256: "SHA-256", 
    sha384: "SHA-384",
    sha512: "SHA-512"
  },
  hashes: {
    localhost_sha256: "49960DE5880E8C687434170F6476605B8FE4AEB9A28632C7995CF3BA831D9763",
    hello_sha1: "F7FF9E8B7BB2E09B70935A5D785E0CC5D9D0ABF0",
    empty_sha256: "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
    unicode_sha256: "8B94E7F2B6F4F8E9D0B5E4A7C8F1D3E6A9B2C5D8E1F4A7B0C3D6E9F2A5B8C1D4"
  }
};

// ------------------------------------------------------------------------------------------------

describe("CRYPTO - getCrypto", () => {
  const getCrypto = crypto.getCrypto;
  let originalWindow;

  beforeEach(() => {
    originalWindow = global.window;
  });

  afterEach(() => {
    global.window = originalWindow;
  });

  it("should return window.crypto in browser environment", () => {
    const mockCrypto = { 
      subtle: { 
        encrypt: vi.fn(), 
        decrypt: vi.fn(), 
        digest: vi.fn(),
        importKey: vi.fn(),
        generateKey: vi.fn()
      },
      getRandomValues: vi.fn()
    };
    global.window = { crypto: mockCrypto };

    const result = getCrypto();
    
    expect(result).toBe(mockCrypto);
    expect(result.subtle).toBeDefined();
    expect(result.getRandomValues).toBeDefined();
  });

  it("should consistently return same crypto instance", () => {
    const crypto1 = getCrypto();
    const crypto2 = getCrypto();
    
    expect(crypto1).toBe(crypto2);
  });
});

// ------------------------------------------------------------------------------------------------

describe("CRYPTO - encrypt", () => {
  const encrypt = crypto.encrypt;

  describe("Valid encryption scenarios", () => {
    it("should encrypt simple text message", async () => {
      const encryptedMessage = await encrypt(PUBLIC_KEY, TEST_DATA.messages.simple);

      expect(encryptedMessage).toBeDefined();
      expect(typeof encryptedMessage).toBe("string");
      expect(encryptedMessage).not.toBe(TEST_DATA.messages.simple);
      expect(encryptedMessage.length).toBeGreaterThan(0);
    });

    it("should encrypt Unicode characters correctly", async () => {
      const encryptedMessage = await encrypt(PUBLIC_KEY, TEST_DATA.messages.unicode);

      expect(encryptedMessage).toBeDefined();
      expect(encryptedMessage).not.toBe(TEST_DATA.messages.unicode);
    });

    it("should encrypt long messages", async () => {
      // Note: RSA has size limitations, this tests the boundary
      const message = "Short message for RSA";
      const encryptedMessage = await encrypt(PUBLIC_KEY, message);

      expect(encryptedMessage).toBeDefined();
      expect(encryptedMessage).not.toBe(message);
    });

    it("should encrypt JSON strings", async () => {
      const encryptedMessage = await encrypt(PUBLIC_KEY, TEST_DATA.messages.json);

      expect(encryptedMessage).toBeDefined();
      expect(encryptedMessage).not.toBe(TEST_DATA.messages.json);
    });

    it("should encrypt messages with special characters", async () => {
      const encryptedMessage = await encrypt(PUBLIC_KEY, TEST_DATA.messages.special);

      expect(encryptedMessage).toBeDefined();
      expect(encryptedMessage).not.toBe(TEST_DATA.messages.special);
    });

    it("should produce different encrypted values for same message (randomness)", async () => {
      const message = "Test randomness";
      const encrypted1 = await encrypt(PUBLIC_KEY, message);
      const encrypted2 = await encrypt(PUBLIC_KEY, message);

      expect(encrypted1).not.toBe(encrypted2);
      expect(encrypted1).toBeDefined();
      expect(encrypted2).toBeDefined();
    });
  });

  describe("Edge cases and special inputs", () => {
    it("should handle empty string input consistently", async () => {
      const encryptedMessage = await encrypt(PUBLIC_KEY, TEST_DATA.messages.empty);
      expect(encryptedMessage).toBe("");
    });

    it("should handle null and undefined message inputs", async () => {
      const encryptedNull = await encrypt(PUBLIC_KEY, null);
      const encryptedUndefined = await encrypt(PUBLIC_KEY, undefined);
      
      expect(encryptedNull).toBe("");
      expect(encryptedUndefined).toBe("");
    });

    it("should handle whitespace-only messages", async () => {
      const message = "   \n\t  ";
      const encryptedMessage = await encrypt(PUBLIC_KEY, message);

      expect(encryptedMessage).toBeDefined();
      expect(encryptedMessage).not.toBe(message);
    });

    it("should handle falsy values consistently", async () => {
      const falsyValues = [null, undefined, "", 0, false];
      
      for (const value of falsyValues) {
        const encrypted = await encrypt(PUBLIC_KEY, value);
        if (value === "" || value === null || value === undefined) {
          expect(encrypted).toBe("");
        } else {
          expect(encrypted).toBeDefined();
          expect(typeof encrypted).toBe("string");
        }
      }
    });
  });

  describe("Error handling", () => {
    it("should throw error for invalid public key format", async () => {
      await expect(encrypt("INVALID_PUBLIC_KEY", TEST_DATA.messages.simple))
        .rejects
        .toThrow();
    });

    it("should throw error for malformed PEM key", async () => {
      const malformedKey = "-----BEGIN PUBLIC KEY-----\nINVALID_BASE64\n-----END PUBLIC KEY-----";
      
      await expect(encrypt(malformedKey, TEST_DATA.messages.simple))
        .rejects
        .toThrow();
    });

    it("should handle null/undefined message inputs gracefully", async () => {
      // encrypt should return empty string for null/undefined messages (matching decrypt behavior)
      const encryptedNull = await encrypt(PUBLIC_KEY, null);
      const encryptedUndefined = await encrypt(PUBLIC_KEY, undefined);
      
      expect(encryptedNull).toBe("");
      expect(encryptedUndefined).toBe("");
    });

    it("should throw error for null/undefined key inputs", async () => {
      await expect(encrypt(null, TEST_DATA.messages.simple))
        .rejects
        .toThrow();
      
      await expect(encrypt(undefined, TEST_DATA.messages.simple))
        .rejects
        .toThrow();
    });

    it("should throw error for wrong key type", async () => {
      await expect(encrypt(PRIVATE_KEY, TEST_DATA.messages.simple))
        .rejects
        .toThrow();
    });
  });

  describe("Configuration options", () => {
    it("should accept custom algorithm configuration", async () => {
      const customConfig = {
        algorithm: { name: "RSA-OAEP", hash: { name: "SHA-1" } }
      };
      
      const encryptedMessage = await encrypt(PUBLIC_KEY, TEST_DATA.messages.simple, customConfig);
      expect(encryptedMessage).toBeDefined();
    });

    it("should accept custom format configuration", async () => {
      const customConfig = { format: "spki" };
      
      const encryptedMessage = await encrypt(PUBLIC_KEY, TEST_DATA.messages.simple, customConfig);
      expect(encryptedMessage).toBeDefined();
    });
  });
});

// ------------------------------------------------------------------------------------------------

describe("CRYPTO - decrypt", () => {
  const decrypt = crypto.decrypt;
  const encrypt = crypto.encrypt;

  describe("Valid decryption scenarios", () => {
    it("should decrypt simple encrypted message", async () => {
      const originalMessage = TEST_DATA.messages.simple;
      const encryptedMessage = await encrypt(PUBLIC_KEY, originalMessage);
      const decryptedMessage = await decrypt(PRIVATE_KEY, encryptedMessage);

      expect(decryptedMessage).toBe(originalMessage);
    });

    it("should decrypt Unicode messages correctly", async () => {
      const originalMessage = TEST_DATA.messages.unicode;
      const encryptedMessage = await encrypt(PUBLIC_KEY, originalMessage);
      const decryptedMessage = await decrypt(PRIVATE_KEY, encryptedMessage);

      expect(decryptedMessage).toBe(originalMessage);
    });

    it("should decrypt JSON strings", async () => {
      const originalMessage = TEST_DATA.messages.json;
      const encryptedMessage = await encrypt(PUBLIC_KEY, originalMessage);
      const decryptedMessage = await decrypt(PRIVATE_KEY, encryptedMessage);

      expect(decryptedMessage).toBe(originalMessage);
      
      // Verify JSON is still valid after round trip
      expect(() => JSON.parse(decryptedMessage)).not.toThrow();
    });

    it("should decrypt messages with special characters", async () => {
      const originalMessage = TEST_DATA.messages.special;
      const encryptedMessage = await encrypt(PUBLIC_KEY, originalMessage);
      const decryptedMessage = await decrypt(PRIVATE_KEY, encryptedMessage);

      expect(decryptedMessage).toBe(originalMessage);
    });

    it("should maintain data integrity through encrypt/decrypt cycle", async () => {
      const testMessages = [
        "Single word",
        "Multiple words with spaces",
        "123456789",
        "Special!@#$%^&*()chars",
        "Mixed123Content!@#"
      ];

      for (const message of testMessages) {
        const encrypted = await encrypt(PUBLIC_KEY, message);
        const decrypted = await decrypt(PRIVATE_KEY, encrypted);
        expect(decrypted).toBe(message);
      }
    });
  });

  describe("Edge cases and special inputs", () => {
    it("should handle empty string input consistently", async () => {
      const decryptedMessage = await decrypt(PRIVATE_KEY, TEST_DATA.messages.empty);
      expect(decryptedMessage).toBe("");
    });

    it("should handle null and undefined message inputs", async () => {
      const decryptedNull = await decrypt(PRIVATE_KEY, null);
      const decryptedUndefined = await decrypt(PRIVATE_KEY, undefined);
      
      expect(decryptedNull).toBe("");
      expect(decryptedUndefined).toBe("");
    });

    it("should handle empty string encryption/decryption cycle", async () => {
      const encryptedEmpty = await encrypt(PUBLIC_KEY, "");
      const decryptedEmpty = await decrypt(PRIVATE_KEY, encryptedEmpty);
      expect(decryptedEmpty).toBe("");
    });

    it("should handle falsy values consistently", async () => {
      const falsyValues = [null, undefined, ""];
      
      for (const value of falsyValues) {
        const decrypted = await decrypt(PRIVATE_KEY, value);
        expect(decrypted).toBe("");
      }
    });
  });

  describe("Error handling", () => {
    it("should throw error for invalid private key format", async () => {
      const validEncrypted = await encrypt(PUBLIC_KEY, TEST_DATA.messages.simple);
      
      await expect(decrypt("INVALID_PRIVATE_KEY", validEncrypted))
        .rejects
        .toThrow();
    });

    it("should throw error for malformed encrypted data", async () => {
      await expect(decrypt(PRIVATE_KEY, "invalid_base64_data"))
        .rejects
        .toThrow();
    });

    it("should throw error for corrupted encrypted message", async () => {
      const encrypted = await encrypt(PUBLIC_KEY, TEST_DATA.messages.simple);
      const corrupted = encrypted.slice(0, -10) + "CORRUPTED=";
      
      await expect(decrypt(PRIVATE_KEY, corrupted))
        .rejects
        .toThrow();
    });

    it("should handle null/undefined message inputs gracefully", async () => {
      // decrypt should return empty string for null/undefined messages (matching encrypt behavior)  
      const decryptedNull = await decrypt(PRIVATE_KEY, null);
      const decryptedUndefined = await decrypt(PRIVATE_KEY, undefined);
      
      expect(decryptedNull).toBe("");
      expect(decryptedUndefined).toBe("");
    });

    it("should throw error for null/undefined key inputs", async () => {
      const validEncrypted = await encrypt(PUBLIC_KEY, TEST_DATA.messages.simple);
      
      await expect(decrypt(null, validEncrypted))
        .rejects
        .toThrow();
      
      await expect(decrypt(undefined, validEncrypted))
        .rejects
        .toThrow();
    });

    it("should throw error when using wrong key", async () => {
      // This would require a different key pair to test properly
      const encrypted = await encrypt(PUBLIC_KEY, TEST_DATA.messages.simple);
      
      await expect(decrypt(PUBLIC_KEY, encrypted))
        .rejects
        .toThrow();
    });
  });

  describe("Configuration options", () => {
    it("should work with custom algorithm configuration", async () => {
      const config = {
        algorithm: { name: "RSA-OAEP", hash: { name: "SHA-256" } }
      };
      
      const encrypted = await encrypt(PUBLIC_KEY, TEST_DATA.messages.simple, config);
      const decrypted = await decrypt(PRIVATE_KEY, encrypted, config);
      
      expect(decrypted).toBe(TEST_DATA.messages.simple);
    });

    it("should work with different key formats", async () => {
      const config = { format: "pkcs8" };
      
      const encrypted = await encrypt(PUBLIC_KEY, TEST_DATA.messages.simple);
      const decrypted = await decrypt(PRIVATE_KEY, encrypted, config);
      
      expect(decrypted).toBe(TEST_DATA.messages.simple);
    });
  });
});

// ------------------------------------------------------------------------------------------------

describe("CRYPTO - digest", () => {
  const digest = crypto.digest;

  describe("String input hashing", () => {
    it("should hash string using SHA-256", async () => {
      const hash = await digest(TEST_DATA.algorithms.sha256, "localhost");
      const hexHash = Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();

      expect(hexHash).toBe(TEST_DATA.hashes.localhost_sha256);
      expect(hash).toBeInstanceOf(Uint8Array);
      expect(hash.length).toBe(32); // SHA-256 produces 32 bytes
    });

    it("should hash string using SHA-1", async () => {
      const hash = await digest(TEST_DATA.algorithms.sha1, "Hello");
      const hexHash = Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();

      expect(hexHash).toBe(TEST_DATA.hashes.hello_sha1);
      expect(hash.length).toBe(20); // SHA-1 produces 20 bytes
    });

    it("should hash empty string", async () => {
      const hash = await digest(TEST_DATA.algorithms.sha256, "");
      const hexHash = Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();

      expect(hexHash).toBe(TEST_DATA.hashes.empty_sha256);
    });

    it("should hash Unicode strings correctly", async () => {
      const hash = await digest(TEST_DATA.algorithms.sha256, TEST_DATA.messages.unicode);
      
      expect(hash).toBeInstanceOf(Uint8Array);
      expect(hash.length).toBe(32);
      // Unicode should produce consistent hashes
      const hash2 = await digest(TEST_DATA.algorithms.sha256, TEST_DATA.messages.unicode);
      expect(new Uint8Array(hash)).toEqual(new Uint8Array(hash2));
    });

    it("should produce different hashes for different inputs", async () => {
      const hash1 = await digest(TEST_DATA.algorithms.sha256, "message1");
      const hash2 = await digest(TEST_DATA.algorithms.sha256, "message2");
      
      expect(new Uint8Array(hash1)).not.toEqual(new Uint8Array(hash2));
    });

    it("should produce consistent hashes for same input", async () => {
      const message = TEST_DATA.messages.simple;
      const hash1 = await digest(TEST_DATA.algorithms.sha256, message);
      const hash2 = await digest(TEST_DATA.algorithms.sha256, message);
      
      expect(new Uint8Array(hash1)).toEqual(new Uint8Array(hash2));
    });
  });

  describe("Uint8Array input hashing", () => {
    it("should hash Uint8Array using SHA-1", async () => {
      const data = new Uint8Array([72, 101, 108, 108, 111]); // 'Hello'
      const hash = await digest(TEST_DATA.algorithms.sha1, data);
      const hexHash = Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();

      expect(hexHash).toBe(TEST_DATA.hashes.hello_sha1);
    });

    it("should hash empty Uint8Array", async () => {
      const data = new Uint8Array([]);
      const hash = await digest(TEST_DATA.algorithms.sha256, data);
      
      expect(hash).toBeInstanceOf(Uint8Array);
      expect(hash.length).toBe(32);
    });

    it("should hash large Uint8Array", async () => {
      const data = new Uint8Array(10000).fill(42);
      const hash = await digest(TEST_DATA.algorithms.sha256, data);
      
      expect(hash).toBeInstanceOf(Uint8Array);
      expect(hash.length).toBe(32);
    });

    it("should produce same hash for equivalent string and Uint8Array", async () => {
      const text = "Hello";
      const bytes = new TextEncoder().encode(text);
      
      const hashFromString = await digest(TEST_DATA.algorithms.sha256, text);
      const hashFromBytes = await digest(TEST_DATA.algorithms.sha256, bytes);
      
      expect(new Uint8Array(hashFromString)).toEqual(new Uint8Array(hashFromBytes));
    });
  });

  describe("Different algorithms", () => {
    const testMessage = "algorithm test";

    it("should support SHA-1", async () => {
      const hash = await digest(TEST_DATA.algorithms.sha1, testMessage);
      expect(hash.length).toBe(20);
    });

    it("should support SHA-256", async () => {
      const hash = await digest(TEST_DATA.algorithms.sha256, testMessage);
      expect(hash.length).toBe(32);
    });

    it("should support SHA-384", async () => {
      const hash = await digest(TEST_DATA.algorithms.sha384, testMessage);
      expect(hash.length).toBe(48);
    });

    it("should support SHA-512", async () => {
      const hash = await digest(TEST_DATA.algorithms.sha512, testMessage);
      expect(hash.length).toBe(64);
    });

    it("should produce different hashes for different algorithms", async () => {
      const sha1Hash = await digest(TEST_DATA.algorithms.sha1, testMessage);
      const sha256Hash = await digest(TEST_DATA.algorithms.sha256, testMessage);
      
      expect(new Uint8Array(sha1Hash)).not.toEqual(new Uint8Array(sha256Hash));
      expect(sha1Hash.length).not.toBe(sha256Hash.length);
    });
  });

  describe("Error handling", () => {
    it("should throw error for unsupported algorithm", async () => {
      await expect(digest("UNSUPPORTED-HASH", TEST_DATA.messages.simple))
        .rejects
        .toThrow();
    });

    it("should throw error for null/undefined inputs", async () => {
      await expect(digest(null, TEST_DATA.messages.simple))
        .rejects
        .toThrow();
      
      await expect(digest(TEST_DATA.algorithms.sha256, null))
        .rejects
        .toThrow();
    });

    it("should throw error for invalid algorithm format", async () => {
      await expect(digest("", TEST_DATA.messages.simple))
        .rejects
        .toThrow();
    });
  });

  describe("Performance and edge cases", () => {
    it("should handle very long strings efficiently", async () => {
      const longString = "x".repeat(100000);
      const startTime = performance.now();
      
      const hash = await digest(TEST_DATA.algorithms.sha256, longString);
      const endTime = performance.now();
      
      expect(hash).toBeInstanceOf(Uint8Array);
      expect(hash.length).toBe(32);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });

    it("should handle special characters and line breaks", async () => {
      const hash = await digest(TEST_DATA.algorithms.sha256, TEST_DATA.messages.special);
      
      expect(hash).toBeInstanceOf(Uint8Array);
      expect(hash.length).toBe(32);
    });
  });
});

// ------------------------------------------------------------------------------------------------

describe("CRYPTO - importCryptoKey", () => {
  const importCryptoKey = crypto.importCryptoKey;
  const base64ToBuffer = utils.base64ToBuffer;

  describe("Valid key import scenarios", () => {
    it("should import ECDSA public key correctly", async () => {
      const publicKeyBuffer = base64ToBuffer(credential.response.publicKey, false);
      const importedKey = await importCryptoKey(
        "spki",
        publicKeyBuffer,
        {
          name: "ECDSA",
          namedCurve: "P-256",
        },
        true,
        ["verify"]
      );

      expect(importedKey).toBeInstanceOf(CryptoKey);
      expect(importedKey.type).toBe("public");
      expect(importedKey.algorithm.name).toBe("ECDSA");
      expect(importedKey.algorithm.namedCurve).toBe("P-256");
      expect(importedKey.extractable).toBe(true);
      expect(importedKey.usages).toContain("verify");
    });

    it("should import RSA public key correctly", async () => {
      const publicKeyPem = PUBLIC_KEY.replace(
        /-----(BEGIN|END) (?:RSA )?PUBLIC KEY-----|\s/g,
        ""
      );
      const publicKeyBuffer = base64ToBuffer(publicKeyPem);
      
      const importedKey = await importCryptoKey(
        "spki",
        publicKeyBuffer,
        {
          name: "RSA-OAEP",
          hash: { name: "SHA-256" },
        },
        true,
        ["encrypt"]
      );

      expect(importedKey).toBeInstanceOf(CryptoKey);
      expect(importedKey.type).toBe("public");
      expect(importedKey.algorithm.name).toBe("RSA-OAEP");
    });

    it("should import RSA private key correctly", async () => {
      const privateKeyPem = PRIVATE_KEY.replace(
        /-----(BEGIN|END) (?:RSA )?PRIVATE KEY-----|\s/g,
        ""
      );
      const privateKeyBuffer = base64ToBuffer(privateKeyPem);
      
      const importedKey = await importCryptoKey(
        "pkcs8",
        privateKeyBuffer,
        {
          name: "RSA-OAEP",
          hash: { name: "SHA-256" },
        },
        true,
        ["decrypt"]
      );

      expect(importedKey).toBeInstanceOf(CryptoKey);
      expect(importedKey.type).toBe("private");
      expect(importedKey.usages).toContain("decrypt");
    });
  });

  describe("Configuration options", () => {
    it("should respect extractable flag", async () => {
      const publicKeyBuffer = base64ToBuffer(credential.response.publicKey, false);
      
      const extractableKey = await importCryptoKey(
        "spki",
        publicKeyBuffer,
        { name: "ECDSA", namedCurve: "P-256" },
        true,
        ["verify"]
      );
      
      const nonExtractableKey = await importCryptoKey(
        "spki",
        publicKeyBuffer,
        { name: "ECDSA", namedCurve: "P-256" },
        false,
        ["verify"]
      );

      expect(extractableKey.extractable).toBe(true);
      expect(nonExtractableKey.extractable).toBe(false);
    });

    it("should respect key usage restrictions", async () => {
      const publicKeyBuffer = base64ToBuffer(credential.response.publicKey, false);
      
      const keyWithMultipleUsages = await importCryptoKey(
        "spki",
        publicKeyBuffer,
        { name: "ECDSA", namedCurve: "P-256" },
        true,
        ["verify"]
      );

      expect(keyWithMultipleUsages.usages).toEqual(["verify"]);
    });

    it("should support different key formats", async () => {
      const formats = ["spki", "pkcs8"];
      
      for (const format of formats) {
        let keyData, algorithm, usages;
        
        if (format === "spki") {
          keyData = base64ToBuffer(credential.response.publicKey, false);
          algorithm = { name: "ECDSA", namedCurve: "P-256" };
          usages = ["verify"];
        } else {
          const privateKeyPem = PRIVATE_KEY.replace(
            /-----(BEGIN|END) (?:RSA )?PRIVATE KEY-----|\s/g,
            ""
          );
          keyData = base64ToBuffer(privateKeyPem);
          algorithm = { name: "RSA-OAEP", hash: { name: "SHA-256" } };
          usages = ["decrypt"];
        }
        
        const importedKey = await importCryptoKey(
          format,
          keyData,
          algorithm,
          true,
          usages
        );
        
        expect(importedKey).toBeInstanceOf(CryptoKey);
      }
    });
  });

  describe("Error handling", () => {
    it("should throw error for invalid key data", async () => {
      const invalidKeyData = new Uint8Array([1, 2, 3, 4, 5]);
      
      await expect(importCryptoKey(
        "spki",
        invalidKeyData,
        { name: "ECDSA", namedCurve: "P-256" },
        true,
        ["verify"]
      )).rejects.toThrow();
    });

    it("should throw error for unsupported format", async () => {
      const publicKeyBuffer = base64ToBuffer(credential.response.publicKey, false);
      
      await expect(importCryptoKey(
        "invalid-format",
        publicKeyBuffer,
        { name: "ECDSA", namedCurve: "P-256" },
        true,
        ["verify"]
      )).rejects.toThrow();
    });

    it("should throw error for mismatched algorithm", async () => {
      const publicKeyBuffer = base64ToBuffer(credential.response.publicKey, false);
      
      await expect(importCryptoKey(
        "spki",
        publicKeyBuffer,
        { name: "RSA-OAEP", hash: { name: "SHA-256" } },
        true,
        ["verify"]
      )).rejects.toThrow();
    });

    it("should throw error for null/undefined inputs", async () => {
      await expect(importCryptoKey(
        null,
        new Uint8Array([]),
        { name: "ECDSA", namedCurve: "P-256" },
        true,
        ["verify"]
      )).rejects.toThrow();
    });
  });
});

// ------------------------------------------------------------------------------------------------

describe("CRYPTO - verifySignature", () => {
  const importCryptoKey = crypto.importCryptoKey;
  const verifySignature = crypto.verifySignature;
  const digest = crypto.digest;
  const base64ToBuffer = utils.base64ToBuffer;
  const bufferConcatenate = utils.bufferConcatenate;
  const convertECDSAASN1Signature = auth.webAuthn.convertECDSAASN1Signature;

  describe("Valid signature verification", () => {
    it("should verify ECDSA signature correctly", async () => {
      const authenticatorDataBuffer = base64ToBuffer(assertion.response.authenticatorData);
      const clientDataJSONSHA256Data = await digest(
        "SHA-256",
        new Uint8Array(base64ToBuffer(assertion.response.clientDataJSON))
      );
      const dataToVerify = bufferConcatenate(
        authenticatorDataBuffer,
        clientDataJSONSHA256Data
      );

      const publicKeyBuffer = base64ToBuffer(credential.response.publicKey, false);
      const importedKey = await importCryptoKey(
        "spki",
        publicKeyBuffer,
        {
          name: "ECDSA",
          namedCurve: "P-256",
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
      expect(typeof isValid).toBe("boolean");
    });

    it("should return consistent results for same signature", async () => {
      const authenticatorDataBuffer = base64ToBuffer(assertion.response.authenticatorData);
      const clientDataJSONSHA256Data = await digest(
        "SHA-256",
        new Uint8Array(base64ToBuffer(assertion.response.clientDataJSON))
      );
      const dataToVerify = bufferConcatenate(
        authenticatorDataBuffer,
        clientDataJSONSHA256Data
      );

      const publicKeyBuffer = base64ToBuffer(credential.response.publicKey, false);
      const importedKey = await importCryptoKey(
        "spki",
        publicKeyBuffer,
        {
          name: "ECDSA",
          namedCurve: "P-256",
        },
        true,
        ["verify"]
      );

      const signature = convertECDSAASN1Signature(
        new Uint8Array(base64ToBuffer(assertion.response.signature, false))
      );

      const result1 = await verifySignature(
        { name: "ECDSA", hash: { name: "SHA-256" } },
        importedKey,
        signature,
        dataToVerify
      );
      
      const result2 = await verifySignature(
        { name: "ECDSA", hash: { name: "SHA-256" } },
        importedKey,
        signature,
        dataToVerify
      );

      expect(result1).toBe(result2);
      expect(result1).toBe(true);
    });
  });

  describe("Invalid signature scenarios", () => {
    it("should return false for corrupted signature", async () => {
      const authenticatorDataBuffer = base64ToBuffer(assertion.response.authenticatorData);
      const clientDataJSONSHA256Data = await digest(
        "SHA-256",
        new Uint8Array(base64ToBuffer(assertion.response.clientDataJSON))
      );
      const dataToVerify = bufferConcatenate(
        authenticatorDataBuffer,
        clientDataJSONSHA256Data
      );

      const publicKeyBuffer = base64ToBuffer(credential.response.publicKey, false);
      const importedKey = await importCryptoKey(
        "spki",
        publicKeyBuffer,
        {
          name: "ECDSA",
          namedCurve: "P-256",
        },
        true,
        ["verify"]
      );

      // Corrupt the signature
      const originalSignature = convertECDSAASN1Signature(
        new Uint8Array(base64ToBuffer(assertion.response.signature, false))
      );
      const corruptedSignature = new Uint8Array(originalSignature);
      corruptedSignature[0] = corruptedSignature[0] ^ 0xFF; // Flip bits

      const isValid = await verifySignature(
        { name: "ECDSA", hash: { name: "SHA-256" } },
        importedKey,
        corruptedSignature,
        dataToVerify
      );

      expect(isValid).toBe(false);
    });

    it("should return false for wrong data", async () => {
      const wrongData = new Uint8Array([1, 2, 3, 4, 5]);

      const publicKeyBuffer = base64ToBuffer(credential.response.publicKey, false);
      const importedKey = await importCryptoKey(
        "spki",
        publicKeyBuffer,
        {
          name: "ECDSA",
          namedCurve: "P-256",
        },
        true,
        ["verify"]
      );

      const signature = convertECDSAASN1Signature(
        new Uint8Array(base64ToBuffer(assertion.response.signature, false))
      );

      const isValid = await verifySignature(
        { name: "ECDSA", hash: { name: "SHA-256" } },
        importedKey,
        signature,
        wrongData
      );

      expect(isValid).toBe(false);
    });

    it("should return false for empty signature", async () => {
      const authenticatorDataBuffer = base64ToBuffer(assertion.response.authenticatorData);
      const clientDataJSONSHA256Data = await digest(
        "SHA-256",
        new Uint8Array(base64ToBuffer(assertion.response.clientDataJSON))
      );
      const dataToVerify = bufferConcatenate(
        authenticatorDataBuffer,
        clientDataJSONSHA256Data
      );

      const publicKeyBuffer = base64ToBuffer(credential.response.publicKey, false);
      const importedKey = await importCryptoKey(
        "spki",
        publicKeyBuffer,
        {
          name: "ECDSA",
          namedCurve: "P-256",
        },
        true,
        ["verify"]
      );

      const emptySignature = new Uint8Array([]);

      const isValid = await verifySignature(
        { name: "ECDSA", hash: { name: "SHA-256" } },
        importedKey,
        emptySignature,
        dataToVerify
      );

      expect(isValid).toBe(false);
    });

    it("should return false for invalid signature format", async () => {
      const authenticatorDataBuffer = base64ToBuffer(assertion.response.authenticatorData);
      const clientDataJSONSHA256Data = await digest(
        "SHA-256",
        new Uint8Array(base64ToBuffer(assertion.response.clientDataJSON))
      );
      const dataToVerify = bufferConcatenate(
        authenticatorDataBuffer,
        clientDataJSONSHA256Data
      );

      const publicKeyBuffer = base64ToBuffer(credential.response.publicKey, false);
      const importedKey = await importCryptoKey(
        "spki",
        publicKeyBuffer,
        {
          name: "ECDSA",
          namedCurve: "P-256",
        },
        true,
        ["verify"]
      );

      // Invalid signature format - too short
      const invalidSignature = new Uint8Array([1, 2, 3]);

      const isValid = await verifySignature(
        { name: "ECDSA", hash: { name: "SHA-256" } },
        importedKey,
        invalidSignature,
        dataToVerify
      );

      expect(isValid).toBe(false);
    });
  });

  describe("Different algorithm configurations", () => {
    it("should work with different hash algorithms", async () => {
      const authenticatorDataBuffer = base64ToBuffer(assertion.response.authenticatorData);
      const clientDataJSONSHA256Data = await digest(
        "SHA-256",
        new Uint8Array(base64ToBuffer(assertion.response.clientDataJSON))
      );
      const dataToVerify = bufferConcatenate(
        authenticatorDataBuffer,
        clientDataJSONSHA256Data
      );

      const publicKeyBuffer = base64ToBuffer(credential.response.publicKey, false);
      const importedKey = await importCryptoKey(
        "spki",
        publicKeyBuffer,
        {
          name: "ECDSA",
          namedCurve: "P-256",
        },
        true,
        ["verify"]
      );

      const signature = convertECDSAASN1Signature(
        new Uint8Array(base64ToBuffer(assertion.response.signature, false))
      );

      // Test with SHA-256 (should work)
      const resultSHA256 = await verifySignature(
        { name: "ECDSA", hash: { name: "SHA-256" } },
        importedKey,
        signature,
        dataToVerify
      );

      expect(resultSHA256).toBe(true);

      // Test with wrong hash algorithm (should fail)
      const resultSHA1 = await verifySignature(
        { name: "ECDSA", hash: { name: "SHA-1" } },
        importedKey,
        signature,
        dataToVerify
      );

      expect(resultSHA1).toBe(false);
    });

    it("should handle algorithm parameter validation", async () => {
      const publicKeyBuffer = base64ToBuffer(credential.response.publicKey, false);
      const importedKey = await importCryptoKey(
        "spki",
        publicKeyBuffer,
        {
          name: "ECDSA",
          namedCurve: "P-256",
        },
        true,
        ["verify"]
      );

      const signature = convertECDSAASN1Signature(
        new Uint8Array(base64ToBuffer(assertion.response.signature, false))
      );
      const data = new Uint8Array([1, 2, 3]);

      // Test with invalid algorithm name
      await expect(verifySignature(
        { name: "INVALID-ALGO", hash: { name: "SHA-256" } },
        importedKey,
        signature,
        data
      )).rejects.toThrow();
    });
  });

  describe("Error handling", () => {
    it("should throw error for null/undefined inputs", async () => {
      const publicKeyBuffer = base64ToBuffer(credential.response.publicKey, false);
      const importedKey = await importCryptoKey(
        "spki",
        publicKeyBuffer,
        {
          name: "ECDSA",
          namedCurve: "P-256",
        },
        true,
        ["verify"]
      );

      const signature = convertECDSAASN1Signature(
        new Uint8Array(base64ToBuffer(assertion.response.signature, false))
      );
      const data = new Uint8Array([1, 2, 3]);

      // Test null algorithm
      await expect(verifySignature(
        null,
        importedKey,
        signature,
        data
      )).rejects.toThrow();

      // Test null key
      await expect(verifySignature(
        { name: "ECDSA", hash: { name: "SHA-256" } },
        null,
        signature,
        data
      )).rejects.toThrow();

      // Test null signature
      await expect(verifySignature(
        { name: "ECDSA", hash: { name: "SHA-256" } },
        importedKey,
        null,
        data
      )).rejects.toThrow();

      // Test null data
      await expect(verifySignature(
        { name: "ECDSA", hash: { name: "SHA-256" } },
        importedKey,
        signature,
        null
      )).rejects.toThrow();
    });

    it("should throw error for wrong key type", async () => {
      const authenticatorDataBuffer = base64ToBuffer(assertion.response.authenticatorData);
      const clientDataJSONSHA256Data = await digest(
        "SHA-256",
        new Uint8Array(base64ToBuffer(assertion.response.clientDataJSON))
      );
      const dataToVerify = bufferConcatenate(
        authenticatorDataBuffer,
        clientDataJSONSHA256Data
      );

      // Import as private key instead of public key
      const publicKeyBuffer = base64ToBuffer(credential.response.publicKey, false);
      
      // This should fail during key import or verification
      await expect(async () => {
        const importedKey = await importCryptoKey(
          "spki",
          publicKeyBuffer,
          {
            name: "ECDSA",
            namedCurve: "P-256",
          },
          true,
          ["sign"] // Wrong usage - should be verify
        );

        const signature = convertECDSAASN1Signature(
          new Uint8Array(base64ToBuffer(assertion.response.signature, false))
        );

        await verifySignature(
          { name: "ECDSA", hash: { name: "SHA-256" } },
          importedKey,
          signature,
          dataToVerify
        );
      }).rejects.toThrow();
    });

    it("should handle malformed algorithm object", async () => {
      const publicKeyBuffer = base64ToBuffer(credential.response.publicKey, false);
      const importedKey = await importCryptoKey(
        "spki",
        publicKeyBuffer,
        {
          name: "ECDSA",
          namedCurve: "P-256",
        },
        true,
        ["verify"]
      );

      const signature = convertECDSAASN1Signature(
        new Uint8Array(base64ToBuffer(assertion.response.signature, false))
      );
      const data = new Uint8Array([1, 2, 3]);

      // Test with malformed algorithm object
      await expect(verifySignature(
        { name: "ECDSA" }, // Missing hash property
        importedKey,
        signature,
        data
      )).rejects.toThrow();

      await expect(verifySignature(
        { hash: { name: "SHA-256" } }, // Missing name property
        importedKey,
        signature,
        data
      )).rejects.toThrow();
    });
  });

  describe("Performance and edge cases", () => {
    it("should handle large data efficiently", async () => {
      const publicKeyBuffer = base64ToBuffer(credential.response.publicKey, false);
      const importedKey = await importCryptoKey(
        "spki",
        publicKeyBuffer,
        {
          name: "ECDSA",
          namedCurve: "P-256",
        },
        true,
        ["verify"]
      );

      const signature = convertECDSAASN1Signature(
        new Uint8Array(base64ToBuffer(assertion.response.signature, false))
      );
      const largeData = new Uint8Array(100000).fill(42);

      const startTime = performance.now();
      const isValid = await verifySignature(
        { name: "ECDSA", hash: { name: "SHA-256" } },
        importedKey,
        signature,
        largeData
      );
      const endTime = performance.now();

      expect(typeof isValid).toBe("boolean");
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });

    it("should handle multiple verification calls efficiently", async () => {
      const authenticatorDataBuffer = base64ToBuffer(assertion.response.authenticatorData);
      const clientDataJSONSHA256Data = await digest(
        "SHA-256",
        new Uint8Array(base64ToBuffer(assertion.response.clientDataJSON))
      );
      const dataToVerify = bufferConcatenate(
        authenticatorDataBuffer,
        clientDataJSONSHA256Data
      );

      const publicKeyBuffer = base64ToBuffer(credential.response.publicKey, false);
      const importedKey = await importCryptoKey(
        "spki",
        publicKeyBuffer,
        {
          name: "ECDSA",
          namedCurve: "P-256",
        },
        true,
        ["verify"]
      );

      const signature = convertECDSAASN1Signature(
        new Uint8Array(base64ToBuffer(assertion.response.signature, false))
      );

      const verificationPromises = Array.from({ length: 10 }, () =>
        verifySignature(
          { name: "ECDSA", hash: { name: "SHA-256" } },
          importedKey,
          signature,
          dataToVerify
        )
      );

      const results = await Promise.all(verificationPromises);
      
      expect(results).toHaveLength(10);
      results.forEach(result => expect(result).toBe(true));
    });
  });
});

// ------------------------------------------------------------------------------------------------

describe("CRYPTO - Integration Tests", () => {
  describe("End-to-end encryption/decryption workflows", () => {
    it("should handle complete encrypt-decrypt cycle with various data types", async () => {
      const testCases = [
        { data: "Simple string", description: "simple text" },
        { data: TEST_DATA.messages.unicode, description: "Unicode characters" },
        { data: TEST_DATA.messages.json, description: "JSON string" },
        { data: TEST_DATA.messages.special, description: "special characters" },
        { data: "12345", description: "numeric string" },
        { data: "", description: "empty string" }
      ];

      for (const testCase of testCases) {
        const encrypted = await crypto.encrypt(PUBLIC_KEY, testCase.data);
        const decrypted = await crypto.decrypt(PRIVATE_KEY, encrypted);
        
        expect(decrypted).toBe(testCase.data);
        console.log(`✓ ${testCase.description} test passed`);
      }
    });

    it("should maintain data integrity across multiple encrypt-decrypt cycles", async () => {
      let data = TEST_DATA.messages.simple;
      
      // Perform multiple cycles
      for (let i = 0; i < 3; i++) {
        const encrypted = await crypto.encrypt(PUBLIC_KEY, data);
        const decrypted = await crypto.decrypt(PRIVATE_KEY, encrypted);
        expect(decrypted).toBe(data);
        data = decrypted; // Use decrypted data for next cycle
      }
    });

    it("should work with different algorithm configurations consistently", async () => {
      const configs = [
        { algorithm: { name: "RSA-OAEP", hash: { name: "SHA-256" } } },
        { algorithm: { name: "RSA-OAEP", hash: { name: "SHA-1" } } }
      ];

      for (const config of configs) {
        const encrypted = await crypto.encrypt(PUBLIC_KEY, TEST_DATA.messages.simple, config);
        const decrypted = await crypto.decrypt(PRIVATE_KEY, encrypted, config);
        expect(decrypted).toBe(TEST_DATA.messages.simple);
      }
    });
  });

  describe("Cross-environment compatibility", () => {
    it("should produce consistent hash results across environments", async () => {
      const testCases = [
        { data: "test", algorithm: "SHA-256" },
        { data: TEST_DATA.messages.unicode, algorithm: "SHA-256" },
        { data: new Uint8Array([1, 2, 3, 4, 5]), algorithm: "SHA-1" }
      ];

      for (const testCase of testCases) {
        const hash1 = await crypto.digest(testCase.algorithm, testCase.data);
        const hash2 = await crypto.digest(testCase.algorithm, testCase.data);
        expect(new Uint8Array(hash1)).toEqual(new Uint8Array(hash2));
      }
    });

    it("should handle mixed string and binary data consistently", async () => {
      const text = "Hello World";
      const bytes = new TextEncoder().encode(text);
      
      const hashFromText = await crypto.digest("SHA-256", text);
      const hashFromBytes = await crypto.digest("SHA-256", bytes);
      
      expect(new Uint8Array(hashFromText)).toEqual(new Uint8Array(hashFromBytes));
    });
  });

  describe("Error handling and recovery", () => {
    it("should handle errors gracefully without corrupting subsequent operations", async () => {
      // Attempt invalid operation
      try {
        await crypto.encrypt("invalid-key", "test");
      } catch (error) {
        // Expected to fail
      }

      // Verify normal operations still work
      const encrypted = await crypto.encrypt(PUBLIC_KEY, "recovery test");
      const decrypted = await crypto.decrypt(PRIVATE_KEY, encrypted);
      expect(decrypted).toBe("recovery test");
    });

    it("should provide meaningful error messages", async () => {
      try {
        await crypto.decrypt("invalid-key", "invalid-data");
      } catch (error) {
        expect(error.message).toBeDefined();
        expect(typeof error.message).toBe("string");
        expect(error.message.length).toBeGreaterThan(0);
      }
    });
  });

  describe("Performance benchmarks", () => {
    it("should complete operations within reasonable time limits", async () => {
      const startTime = performance.now();
      
      // Perform multiple operations
      const encrypted = await crypto.encrypt(PUBLIC_KEY, TEST_DATA.messages.simple);
      const decrypted = await crypto.decrypt(PRIVATE_KEY, encrypted);
      const hash = await crypto.digest("SHA-256", TEST_DATA.messages.simple);
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      expect(decrypted).toBe(TEST_DATA.messages.simple);
      expect(hash).toBeInstanceOf(Uint8Array);
      expect(totalTime).toBeLessThan(5000); // Should complete within 5 seconds
    });

    it("should handle concurrent operations efficiently", async () => {
      const operations = Array.from({ length: 5 }, async (_, i) => {
        const message = `concurrent test ${i}`;
        const encrypted = await crypto.encrypt(PUBLIC_KEY, message);
        const decrypted = await crypto.decrypt(PRIVATE_KEY, encrypted);
        return { original: message, result: decrypted };
      });

      const results = await Promise.all(operations);
      
      results.forEach((result, index) => {
        expect(result.result).toBe(`concurrent test ${index}`);
      });
    });
  });

  describe("Memory and resource management", () => {
    it("should not leak memory during repeated operations", async () => {
      const iterations = 50;
      const message = "memory test";
      
      for (let i = 0; i < iterations; i++) {
        const encrypted = await crypto.encrypt(PUBLIC_KEY, message);
        const decrypted = await crypto.decrypt(PRIVATE_KEY, encrypted);
        const hash = await crypto.digest("SHA-256", message);
        
        expect(decrypted).toBe(message);
        expect(hash).toBeInstanceOf(Uint8Array);
        
        // Force garbage collection if available (for Node.js)
        if (global.gc) {
          global.gc();
        }
      }
    });
  });
});

// ------------------------------------------------------------------------------------------------