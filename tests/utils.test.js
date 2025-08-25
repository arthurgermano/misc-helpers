import {
  describe,
  expect,
  it,
  vi,
  assert,
  beforeEach,
  afterEach,
} from "vitest";
import { constants, utils } from "../src/index.js";
import fs from "fs";
import jsonTest from "./testContent.js";

// ------------------------------------------------------------------------------------------------

function deepEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

// ------------------------------------------------------------------------------------------------

describe("UTILS - assign", () => {
  // ----------------------------------------------------------------------------------------------

  const assign = utils.assign;

  // ----------------------------------------------------------------------------------------------

  it("assign should merge two objects successfully", () => {
    const target = { a: 1, b: { c: 2 } };
    const source = { b: { d: 3 }, e: 4 };

    const result = assign(target, source);
    const expected = { a: 1, b: { d: 3 }, e: 4 };

    expect(deepEqual(result, expected)).toBeTruthy();
  });

  // ----------------------------------------------------------------------------------------------

  it("assign should merge two objects successfully with an empty target", () => {
    const target = {};
    const source = { a: 1, b: { c: 2 } };

    const result = assign(target, source);

    assert(deepEqual(result, { a: 1, b: { c: 2 } }));
  });

  // ----------------------------------------------------------------------------------------------

  it("assign should merge two objects successfully with an empty source", () => {
    const target = { a: 1, b: { c: 2 } };
    const source = {};

    const result = assign(target, source);

    assert(deepEqual(result, { a: 1, b: { c: 2 } }));
  });

  // ----------------------------------------------------------------------------------------------

  it("assign should handle non-object target when throwsError=false", () => {
    const target = "notAnObject";
    const source = { a: 1, b: 2 };

    const result = assign(target, source, false);

    expect(result).toBe(null);
  });

  // ----------------------------------------------------------------------------------------------

  it("assign should handle non-object source when throwsError=false", () => {
    const target = { a: 1 };
    const source = "notAnObject";

    const result = assign(target, source, false);

    expect(result).toBe(null);
  });

  // ----------------------------------------------------------------------------------------------

  it("assign should throw an error for non-object target when throwsError=true", () => {
    const target = "notAnObject";
    const source = { a: 1, b: 2 };

    try {
      assign(target, source);
      // If it doesn't throw an error, fail the test
      assert(false);
    } catch (error) {
      assert(
        error.message.includes(
          "Assign Function: The target provided is not an object"
        )
      );
    }
  });

  // ----------------------------------------------------------------------------------------------

  it("assign should throw an error for non-object source when throwsError=true", () => {
    const target = { a: 1 };
    const source = "notAnObject";

    try {
      assign(target, source);
      // If it doesn't throw an error, fail the test
      assert(false);
    } catch (error) {
      assert(
        error.message.includes(
          "Assign Function: The source provided is not an object"
        )
      );
    }
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - base64From", () => {
  // ----------------------------------------------------------------------------------------------

  const base64From = utils.base64From;

  // ----------------------------------------------------------------------------------------------

  it("base64From should return an empty string for non-string input", () => {
    const nonStringInput = 123;
    const result = base64From(nonStringInput);
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("base64From should return an empty string for an empty string input", () => {
    const emptyStringInput = "";
    const result = base64From(emptyStringInput);
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("base64From should correctly decode a valid base64 string", () => {
    const validBase64Input = "SGVsbG8gd29ybGQ=";
    const result = base64From(validBase64Input);
    expect(result).toBe("Hello world");
  });

  // ----------------------------------------------------------------------------------------------

  it("base64From should handle decode to special characters", () => {
    const specialCharactersInput =
      "77-9bmzvv73vv73vv73vv73ilqHvv73vv703ee-_vWLvv70477-9c0rvv73vv73vv70";
    const result = base64From(specialCharactersInput);
    expect(result).toBe("�nl����□��7y�b�8�sJ���");
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - base64FromBase64URLSafe", () => {
  // ----------------------------------------------------------------------------------------------

  const base64FromBase64URLSafe = utils.base64FromBase64URLSafe;

  // ----------------------------------------------------------------------------------------------

  it("should convert URL-safe base64 to standard base64", () => {
    const urlSafeBase64String = "rqXRQrq_mSFhX4c2wSZJrA";
    const expectedBase64String = "rqXRQrq/mSFhX4c2wSZJrA==";
    expect(base64FromBase64URLSafe(urlSafeBase64String)).toBe(
      expectedBase64String
    );
  });

  // ----------------------------------------------------------------------------------------------

  it("should handle base64 strings with different lengths", () => {
    const urlSafeBase64String = "U29tZS1kYXRh";
    const expectedBase64String = "U29tZS1kYXRh";
    expect(base64FromBase64URLSafe(urlSafeBase64String)).toBe(
      expectedBase64String
    );
  });

  // ----------------------------------------------------------------------------------------------

  it("should handle base64 strings with padding characters", () => {
    const urlSafeBase64String = "YW55LXN0cmluZw";
    const expectedBase64String = "YW55LXN0cmluZw==";
    expect(base64FromBase64URLSafe(urlSafeBase64String)).toBe(
      expectedBase64String
    );
  });

  // ----------------------------------------------------------------------------------------------

  it("should handle base64 strings without padding characters", () => {
    const urlSafeBase64String = "c29tZS1kYXRhLXN0cmluZw";
    const expectedBase64String = "c29tZS1kYXRhLXN0cmluZw==";
    expect(base64FromBase64URLSafe(urlSafeBase64String)).toBe(
      expectedBase64String
    );
  });

  // ----------------------------------------------------------------------------------------------

  it("should handle empty strings", () => {
    const urlSafeBase64String = "";
    const expectedBase64String = "";
    expect(base64FromBase64URLSafe(urlSafeBase64String)).toBe(
      expectedBase64String
    );
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - base64FromBuffer", () => {
  // ----------------------------------------------------------------------------------------------

  const base64FromBuffer = utils.base64FromBuffer;

  // ----------------------------------------------------------------------------------------------

  it("base64FromBuffer - should convert an ArrayBuffer to a Base64 string", () => {
    // Create an example ArrayBuffer
    const buffer = new ArrayBuffer(4);
    const view = new Uint8Array(buffer);
    view[0] = 72;
    view[1] = 101;
    view[2] = 108;
    view[3] = 108;

    // Expected Base64 string
    const expectedBase64 = "SGVsbA";

    // Call the function
    const result = base64FromBuffer(buffer);

    // Assert that the result matches the expected Base64 string
    expect(result).toBe(expectedBase64);
  });

  // ----------------------------------------------------------------------------------------------

  it("base64FromBuffer - should return an empty string if the buffer is empty", () => {
    // Create an empty ArrayBuffer
    const buffer = new ArrayBuffer(0);

    // Expected empty Base64 string
    const expectedBase64 = "";

    // Call the function
    const result = base64FromBuffer(buffer);

    // Assert that the result is an empty string
    expect(result).toBe(expectedBase64);
  });

  // ----------------------------------------------------------------------------------------------

  it("base64FromBuffer - should convert an ArrayBuffer with special characters to a Base64 string", () => {
    // Create an example ArrayBuffer with special characters
    const buffer = new ArrayBuffer(6);
    const view = new Uint8Array(buffer);
    view[0] = 72; // 'H'
    view[1] = 101; // 'e'
    view[2] = 108; // 'l'
    view[3] = 108; // 'l'
    view[4] = 111; // 'o'
    view[5] = 240; // Special character (e.g., emoji)

    // Expected Base64 string with special characters
    const expectedBase64 = "SGVsbG/w";

    // Call the function
    const result = base64FromBuffer(buffer);

    // Assert that the result matches the expected Base64 string
    expect(result).toBe(expectedBase64);
  });
  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - base64To", () => {
  // ----------------------------------------------------------------------------------------------

  const base64To = utils.base64To;

  // ----------------------------------------------------------------------------------------------

  it("base64To should return the correct string for non-string input", () => {
    const nonStringInput = 123;
    const result = base64To(nonStringInput);
    expect(result).toBe("MTIz");
  });

  // ----------------------------------------------------------------------------------------------

  it("base64To should throw an error with an incorrect object input", () => {
    try {
      const nonStringInput = {};
      base64To(nonStringInput);
    } catch (error) {
      expect(error.message).toBe(
        "The first argument must be of type string or an instance of Buffer, ArrayBuffer, or Array or an Array-like Object. Received an instance of Object"
      );
    }
  });

  // ----------------------------------------------------------------------------------------------

  it("base64To should correctly encode a string to base64 with default encoding", () => {
    const textInput = "Hello world";
    const result = base64To(textInput);
    expect(result).toBe("SGVsbG8gd29ybGQ");
  });

  // ----------------------------------------------------------------------------------------------

  it("base64To should correctly encode a string to base64 with a specified encoding", () => {
    const textInput = "Hello world";
    const result = base64To(textInput, "utf16le");
    expect(result).toBe("SABlAGwAbABvACAAdwBvAHIAbABkAA");
  });

  // ----------------------------------------------------------------------------------------------

  it("base64To should correctly encode a string to base64 with a specified ASCII encoding", () => {
    const textInput = "Hello world";
    const result = base64To(textInput, "ascii");
    expect(result).toBe("SGVsbG8gd29ybGQ");
  });

  // ----------------------------------------------------------------------------------------------

  it("base64To should handle an empty string input", () => {
    const emptyStringInput = "";
    const result = base64To(emptyStringInput);
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("base64To should handle special characters in the input", () => {
    const specialCharactersInput = "!@#$%^&*()_+";
    const result = base64To(specialCharactersInput);
    expect(result).toBe("IUAjJCVeJiooKV8r");
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - base64ToBuffer", () => {
  // ----------------------------------------------------------------------------------------------

  const base64ToBuffer = utils.base64ToBuffer;

  // ----------------------------------------------------------------------------------------------

  it("base64ToBuffer - should convert a Base64 string to an ArrayBuffer", () => {
    // Example Base64 string
    const base64String = "SGVsbG8sIHdvcmxkIQ==";

    // Expected ArrayBuffer
    const expectedBuffer = new Uint8Array([
      72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33,
    ]).buffer;

    // Call the function
    const result = base64ToBuffer(base64String);

    // Assert that the result matches the expected ArrayBuffer
    expect(result).toEqual(expectedBuffer);
  });

  // ----------------------------------------------------------------------------------------------

  it("base64ToBuffer - should return an empty ArrayBuffer if the Base64 string is empty", () => {
    // Example empty Base64 string
    const base64String = "";

    // Expected empty ArrayBuffer
    const expectedBuffer = new ArrayBuffer(0);

    // Call the function
    const result = base64ToBuffer(base64String);

    // Assert that the result matches the expected empty ArrayBuffer
    expect(result).toEqual(expectedBuffer);
  });

  // ----------------------------------------------------------------------------------------------

  it("base64ToBuffer - should handle Base64 string with very special characters", () => {
    // Example Base64 string with very special characters (including emojis)
    const base64String =
      "8J+klPCfkpzojIPwn5ST8J+klPCfkpzojIPwn5ST8J+klPCfkpzojIPwn5ST8J+klPCfkpzojIPwn5ST8J+klPCfkpzojIPwn5ST"; // Some special characters

    // Expected ArrayBuffer
    const expectedBuffer = new Uint8Array([
      226, 152, 169, 226, 152, 169, 226, 152, 169, 226, 152, 169, 226, 152, 169,
      226, 152, 169, 226, 152, 169, 226, 152, 169, 226, 152, 169, 226, 152, 169,
      226, 152, 169, 226, 152, 169, 226, 152, 169, 226, 152, 169, 226, 152, 169,
    ]).buffer;

    // Call the function
    const result = base64ToBuffer(base64String);

    // Assert that the result matches the expected ArrayBuffer
    expect(result).toEqual(expectedBuffer);
  });
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - base64URLEncode", () => {
  // ----------------------------------------------------------------------------------------------

  const base64URLEncode = utils.base64URLEncode;

  // ----------------------------------------------------------------------------------------------

  it("base64URLEncode should return an empty string for non-string input", () => {
    const nonStringInput = 123;
    const result = base64URLEncode(nonStringInput);
    expect(result).toBe("MTIz");
  });

  // ----------------------------------------------------------------------------------------------

  it("base64URLEncode should correctly encode a string to base64 URL format with default encoding", () => {
    const textInput = "Hello world!";
    const result = base64URLEncode(textInput);
    expect(result).toBe("SGVsbG8gd29ybGQh");
  });

  // ----------------------------------------------------------------------------------------------

  it("base64URLEncode should correctly encode a string to base64 URL format with a specified encoding", () => {
    const textInput = "Hello world!";
    const result = base64URLEncode(textInput, "utf16le");
    expect(result).toBe("SABlAGwAbABvACAAdwBvAHIAbABkACEA");
  });

  // ----------------------------------------------------------------------------------------------

  it("base64URLEncode should handle an empty string input", () => {
    const emptyStringInput = "";
    const result = base64URLEncode(emptyStringInput);
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("base64URLEncode should handle special characters in the input", () => {
    const specialCharactersInput = "!@#$%^&*()_+";
    const result = base64URLEncode(specialCharactersInput);
    expect(result).toBe("IUAjJCVeJiooKV8r");
  });

  // ----------------------------------------------------------------------------------------------

  it("base64URLEncode should translate special chars from resultant base64", () => {
    const specialCharactersInput = "�nl����□��7y�b�8�sJ���";
    const result = base64URLEncode(specialCharactersInput);
    expect(result).toBe(
      "77-9bmzvv73vv73vv73vv73ilqHvv73vv703ee-_vWLvv70477-9c0rvv73vv73vv70"
    );
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - bufferCompare", () => {
  // ----------------------------------------------------------------------------------------------

  const bufferCompare = utils.bufferCompare;

  // ----------------------------------------------------------------------------------------------
  it("bufferCompare - buffers are equal", () => {
    const buffer1 = new Uint8Array([1, 2, 3, 4]).buffer;
    const buffer2 = new Uint8Array([1, 2, 3, 4]).buffer;

    expect(bufferCompare(buffer1, buffer2)).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("bufferCompare - buffers are not equal (different lengths)", () => {
    const buffer1 = new Uint8Array([1, 2, 3, 4]).buffer;
    const buffer2 = new Uint8Array([1, 2, 3, 4, 5]).buffer;

    expect(bufferCompare(buffer1, buffer2)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("bufferCompare - buffers are not equal (same lengths, different content)", () => {
    const buffer1 = new Uint8Array([1, 2, 3, 4]).buffer;
    const buffer2 = new Uint8Array([1, 2, 3, 5]).buffer;

    expect(bufferCompare(buffer1, buffer2)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("bufferCompare - one buffer is null", () => {
    const buffer1 = null;
    const buffer2 = new Uint8Array([1, 2, 3, 4]).buffer;

    expect(bufferCompare(buffer1, buffer2)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("bufferCompare - both buffers are null", () => {
    const buffer1 = null;
    const buffer2 = null;

    expect(bufferCompare(buffer1, buffer2)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("bufferCompare - empty buffers are equal", () => {
    const buffer1 = new Uint8Array([]).buffer;
    const buffer2 = new Uint8Array([]).buffer;

    expect(bufferCompare(buffer1, buffer2)).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("bufferCompare - buffers with special characters", () => {
    const buffer1 = new Uint8Array([0, 255, 128, 64]).buffer;
    const buffer2 = new Uint8Array([0, 255, 128, 64]).buffer;

    expect(bufferCompare(buffer1, buffer2)).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("bufferCompare - buffers with different special characters", () => {
    const buffer1 = new Uint8Array([0, 255, 128, 64]).buffer;
    const buffer2 = new Uint8Array([0, 255, 128, 63]).buffer;

    expect(bufferCompare(buffer1, buffer2)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - bufferConcatenate", () => {
  // ----------------------------------------------------------------------------------------------

  const bufferConcatenate = utils.bufferConcatenate;

  // ----------------------------------------------------------------------------------------------

  it("bufferConcatenate - should concatenate two buffers correctly", () => {
    const buffer1 = new Uint8Array([1, 2, 3]).buffer;
    const buffer2 = new Uint8Array([4, 5, 6]).buffer;
    const concatenated = bufferConcatenate(buffer1, buffer2);

    const expected = new Uint8Array([1, 2, 3, 4, 5, 6]).buffer;
    expect(concatenated).toEqual(expected);
  });

  // -----------------------------------------------------------------------------------------------

  it("bufferConcatenate - should return null if buffer1 is null", () => {
    const buffer1 = null;
    const buffer2 = new Uint8Array([4, 5, 6]).buffer;
    const concatenated = bufferConcatenate(buffer1, buffer2);
    expect(concatenated).toBeNull();
  });

  // -----------------------------------------------------------------------------------------------

  it("bufferConcatenate - should return null if buffer2 is null", () => {
    const buffer1 = new Uint8Array([1, 2, 3]).buffer;
    const buffer2 = null;
    const concatenated = bufferConcatenate(buffer1, buffer2);
    expect(concatenated).toBeNull();
  });

  // -----------------------------------------------------------------------------------------------

  it("bufferConcatenate - should return null if both buffers are null", () => {
    const buffer1 = null;
    const buffer2 = null;
    const concatenated = bufferConcatenate(buffer1, buffer2);
    expect(concatenated).toBeNull();
  });

  // -----------------------------------------------------------------------------------------------

  it("bufferConcatenate - should concatenate two empty buffers correctly", () => {
    const buffer1 = new Uint8Array([]).buffer;
    const buffer2 = new Uint8Array([]).buffer;
    const concatenated = bufferConcatenate(buffer1, buffer2);

    const expected = new Uint8Array([]).buffer;
    expect(concatenated).toEqual(expected);
  });

  // -----------------------------------------------------------------------------------------------

  it("bufferConcatenate - should concatenate buffers with special characters correctly", () => {
    const buffer1 = new Uint8Array([0, 255, 128]).buffer;
    const buffer2 = new Uint8Array([64, 32, 16]).buffer;
    const concatenated = bufferConcatenate(buffer1, buffer2);

    const expected = new Uint8Array([0, 255, 128, 64, 32, 16]).buffer;
    expect(concatenated).toEqual(expected);
  });

  // -----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - bufferFromString", () => {
  // ------------------------------------------------------------------------------------------------

  const bufferFromString = utils.bufferFromString;

  // ------------------------------------------------------------------------------------------------

  it("bufferFromString - should generate a buffer from a string in Node.js environment", () => {
    const str = "Hello, World!";
    const buffer = bufferFromString(str, "utf-8");
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.toString()).toBe(str);
  });

  // ------------------------------------------------------------------------------------------------

  it("bufferFromString - should generate a buffer from a string in browser environment", () => {
    const str = "Hello, World!";
    const buffer = bufferFromString(str);
    expect(buffer).toBeInstanceOf(Uint8Array);
    expect(new TextDecoder().decode(buffer)).toBe(str);
  });

  // ------------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - bufferToString", () => {
  // ----------------------------------------------------------------------------------------------

  const bufferToString = utils.bufferToString;

  // ----------------------------------------------------------------------------------------------

  it("bufferToString - should convert a buffer to a string in Node.js environment", () => {
    const buffer = Buffer.from("Hello, World!", "utf-8");
    const str = bufferToString(buffer, "utf-8");
    expect(str).toBe("Hello, World!");
  });

  // ----------------------------------------------------------------------------------------------

  it("bufferToString - should convert a buffer to a string in browser environment", () => {
    const buffer = new Uint8Array([
      72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100,
    ]);
    const str = bufferToString(buffer, "utf-8");
    expect(str).toBe("Hello, World");
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - currencyBRToFloat", () => {
  // ----------------------------------------------------------------------------------------------

  const currencyBRToFloat = utils.currencyBRToFloat;

  // ----------------------------------------------------------------------------------------------

  it("currencyBRToFloat should convert valid money string to float", () => {
    const moneyString = "R$ 1.234,56";
    const result = currencyBRToFloat(moneyString);
    expect(result).toBe(1234.56);
  });

  // ----------------------------------------------------------------------------------------------

  it("currencyBRToFloat should return false for money string with invalid characters", () => {
    const moneyString = "1A23.B4C56";
    const result = currencyBRToFloat(moneyString);
    expect(result).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("currencyBRToFloat should handle money string with leading and trailing spaces", () => {
    const moneyString = "  789,01  ";
    const result = currencyBRToFloat(moneyString);
    expect(result).toBe(789.01);
  });

  // ----------------------------------------------------------------------------------------------

  it("currencyBRToFloat should return false for money string with only dots", () => {
    const moneyString = "......";
    const result = currencyBRToFloat(moneyString);
    expect(result).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("currencyBRToFloat should return false for money string with only commas", () => {
    const moneyString = ",,,,,,";
    const result = currencyBRToFloat(moneyString);
    expect(result).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  // Test case 6: Empty money string
  it("currencyBRToFloat should return false for empty money string", () => {
    const moneyString = "";
    const result = currencyBRToFloat(moneyString);
    expect(result).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("currencyBRToFloat should maitain the float value equal", () => {
    const moneyString = 1234.56;
    const result = currencyBRToFloat(moneyString);
    expect(result).toBe(1234.56);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - dateFirstHourOfDay", () => {
  // ----------------------------------------------------------------------------------------------

  const dateFirstHourOfDay = utils.dateFirstHourOfDay;

  // ----------------------------------------------------------------------------------------------

  it("dateFirstHourOfDay should set hours, minutes, and seconds to 00:00:00 for a valid date object", () => {
    const inputDate = new Date("2023-01-15T12:34:56");
    const resultDate = dateFirstHourOfDay(inputDate);

    expect(resultDate.getHours()).toBe(0);
    expect(resultDate.getMinutes()).toBe(0);
    expect(resultDate.getSeconds()).toBe(0);
    expect(resultDate.getMilliseconds()).toBe(0);
  });

  // ----------------------------------------------------------------------------------------------

  it("dateFirstHourOfDay should return false for an invalid date input", () => {
    const inputDate = "not a date";
    const result = dateFirstHourOfDay(inputDate);

    expect(result).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("dateFirstHourOfDay should set hours, minutes, and seconds to 00:00:00 for a date with non-zero hours", () => {
    const inputDate = new Date("2023-01-15T08:45:30");
    const resultDate = dateFirstHourOfDay(inputDate);

    expect(resultDate.getHours()).toBe(0);
    expect(resultDate.getMinutes()).toBe(0);
    expect(resultDate.getSeconds()).toBe(0);
    expect(resultDate.getMilliseconds()).toBe(0);
  });

  // ----------------------------------------------------------------------------------------------

  it("dateFirstHourOfDay should set hours, minutes, and seconds to 00:00:00 for a date with non-zero minutes", () => {
    const inputDate = new Date("2023-01-15T15:20:45");
    const resultDate = dateFirstHourOfDay(inputDate);

    expect(resultDate.getHours()).toBe(0);
    expect(resultDate.getMinutes()).toBe(0);
    expect(resultDate.getSeconds()).toBe(0);
    expect(resultDate.getMilliseconds()).toBe(0);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - dateLastHourOfDay", () => {
  // ----------------------------------------------------------------------------------------------

  const dateLastHourOfDay = utils.dateLastHourOfDay;

  // ----------------------------------------------------------------------------------------------

  it("dateLastHourOfDay should set hours, minutes, and seconds to 23:59:59 for a valid date object", () => {
    const inputDate = new Date("2023-01-15T12:34:56");
    const resultDate = dateLastHourOfDay(inputDate);

    expect(resultDate.getHours()).toBe(23);
    expect(resultDate.getMinutes()).toBe(59);
    expect(resultDate.getSeconds()).toBe(59);
    expect(resultDate.getMilliseconds()).toBe(999);
  });

  // ----------------------------------------------------------------------------------------------

  it("dateLastHourOfDay should return false for an invalid date input", () => {
    const inputDate = "not a date";
    const result = dateLastHourOfDay(inputDate);

    expect(result).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("dateLastHourOfDay should set hours, minutes, and seconds to 23:59:59 for a date with non-zero hours", () => {
    const inputDate = new Date("2023-01-15T08:45:30");
    const resultDate = dateLastHourOfDay(inputDate);

    expect(resultDate.getHours()).toBe(23);
    expect(resultDate.getMinutes()).toBe(59);
    expect(resultDate.getSeconds()).toBe(59);
    expect(resultDate.getMilliseconds()).toBe(999);
  });

  // ----------------------------------------------------------------------------------------------

  it("dateLastHourOfDay should set hours, minutes, and seconds to 23:59:59 for a date with non-zero minutes", () => {
    const inputDate = new Date("2023-01-15T15:20:45");
    const resultDate = dateLastHourOfDay(inputDate);

    expect(resultDate.getHours()).toBe(23);
    expect(resultDate.getMinutes()).toBe(59);
    expect(resultDate.getSeconds()).toBe(59);
    expect(resultDate.getMilliseconds()).toBe(999);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - dateToFormat", () => {
  // ----------------------------------------------------------------------------------------------

  const dateToFormat = utils.dateToFormat;

  // ----------------------------------------------------------------------------------------------

  it("dateToFormat should return a string formatted as dd-MM-yyyy for a valid date object with default format", () => {
    const inputDate = new Date("2023-01-15T12:34:56");
    const result = dateToFormat(inputDate);

    expect(result).toBe("15-01-2023");
  });

  // ----------------------------------------------------------------------------------------------

  it("dateToFormat should return a string formatted as MM/dd/yyyy for a valid date object with custom format", () => {
    const inputDate = new Date("2023-01-15T12:34:56");
    const customFormat = "MM/dd/yyyy";
    const result = dateToFormat(inputDate, customFormat);

    expect(result).toBe("01/15/2023");
  });

  // ----------------------------------------------------------------------------------------------

  it("dateToFormat should return false for an invalid date input", () => {
    const inputDate = "not a date";
    const result = dateToFormat(inputDate);

    expect(result).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("dateToFormat should return a string formatted as dd-MM-yyyy for a valid date object with default format and non-zero hours", () => {
    const inputDate = new Date("2023-01-15T08:45:30");
    const result = dateToFormat(inputDate);

    expect(result).toBe("15-01-2023");
  });

  // ----------------------------------------------------------------------------------------------

  it("dateToFormat should return a string formatted as yyyy-MM-dd HH:mm:ss for a valid date object with 'yyyy-MM-dd HH:mm:ss' format", () => {
    const inputDate = new Date("2023-01-15T12:34:56");
    const result = dateToFormat(inputDate, "yyyy-MM-dd HH:mm:ss");

    expect(result).toBe("2023-01-15 12:34:56");
  });

  // ----------------------------------------------------------------------------------------------

  it("dateToFormat should return a string formatted as yyyy-MM for a valid date object with 'yyyy-MM' format", () => {
    const inputDate = new Date("2023-01-15T12:34:56");
    const result = dateToFormat(inputDate, "yyyy-MM");

    expect(result).toBe("2023-01");
  });

  // ----------------------------------------------------------------------------------------------

  it("dateToFormat should return a string formatted as dd-MM-yyyy for a valid date object with default format and non-zero minutes", () => {
    const inputDate = new Date("2023-01-15T12:05:00");
    const result = dateToFormat(inputDate);

    expect(result).toBe("15-01-2023");
  });

  // ----------------------------------------------------------------------------------------------

  it("dateToFormat should return a string formatted as yyyy-MM-dd HH:mm:ss for a valid date object with 'yyyy-MM-dd HH:mm:ss' format and non-zero seconds", () => {
    const inputDate = new Date("2023-01-15T12:34:45");
    const result = dateToFormat(inputDate, "yyyy-MM-dd HH:mm:ss");

    expect(result).toBe("2023-01-15 12:34:45");
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - debouncer", () => {
  // ----------------------------------------------------------------------------------------------

  const debouncer = utils.debouncer;

  // ----------------------------------------------------------------------------------------------

  it("debounce delays function execution", async () => {
    const mockCallback = vi.fn();
    const debouncedCallback = debouncer(mockCallback, 1000);

    debouncedCallback("argument1", "argument2");

    // Assert that the callback is not called immediately
    expect(mockCallback).not.toHaveBeenCalled();

    // Wait for the debounce timeout
    await new Promise((resolve) => setTimeout(resolve, 1100));

    // Assert that the callback is called once with the arguments after the timeout
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith("argument1", "argument2");
  });

  // ----------------------------------------------------------------------------------------------

  it("debounce cancels previous timeouts on subsequent calls", async () => {
    const mockCallback = vi.fn();
    const debouncedCallback = debouncer(mockCallback, 500);

    debouncedCallback("argument1"); // Schedule first call

    // Wait for a shorter duration to ensure first timeout isn't triggered
    await new Promise((resolve) => setTimeout(resolve, 200));

    debouncedCallback("argument2"); // Schedule second call, canceling the first

    // Wait for the longer timeout of the second call
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Assert that the callback is called only once with the arguments from the second call
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith("argument2");
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - deleteKeys", () => {
  // ----------------------------------------------------------------------------------------------

  const deleteKeys = utils.deleteKeys;

  // ----------------------------------------------------------------------------------------------

  it("deleteKeys should delete a single key from the object", () => {
    const inputObject = { a: 1, b: 2, c: 3 };
    const keysToDelete = ["b"];
    const result = deleteKeys(inputObject, keysToDelete);

    expect(result).toHaveProperty("a");
    expect(result.a).toBe(1);
    expect(result).not.toHaveProperty("b");
    expect(result).toHaveProperty("c");
    expect(result.c).toBe(3);
  });

  // ----------------------------------------------------------------------------------------------
  it("deleteKeys should delete multiple keys from the object", () => {
    const inputObject = { a: 1, b: 2, c: 3, d: 4 };
    const keysToDelete = ["b", "d"];
    const result = deleteKeys(inputObject, keysToDelete);

    expect(result).toHaveProperty("a");
    expect(result.a).toBe(1);
    expect(result).not.toHaveProperty("b");
    expect(result).toHaveProperty("c");
    expect(result.c).toBe(3);
    expect(result).not.toHaveProperty("d");
  });

  // ----------------------------------------------------------------------------------------------
  it("deleteKeys should not change the object if the key to delete does not exist", () => {
    const inputObject = { a: 1, b: 2, c: 3 };
    const keysToDelete = ["d"];
    const result = deleteKeys(inputObject, keysToDelete);

    expect(result).toHaveProperty("a");
    expect(result.a).toBe(1);
    expect(result).toHaveProperty("b");
    expect(result.b).toBe(2);
    expect(result).toHaveProperty("c");
    expect(result.c).toBe(3);
    expect(result).not.toHaveProperty("d");
  });

  // ----------------------------------------------------------------------------------------------
  it("deleteKeys should not change an empty object", () => {
    const inputObject = {};
    const keysToDelete = ["a", "b", "c"];
    const result = deleteKeys(inputObject, keysToDelete);

    expect(result).toEqual({});
  });

  // ----------------------------------------------------------------------------------------------
  it("deleteKeys should return the original object if input types are invalid", () => {
    const keysToDelete = ["b"];
    const result = deleteKeys("not an object", keysToDelete);

    expect(result).toEqual("not an object");
  });

  // ----------------------------------------------------------------------------------------------
  it("deleteKeys should return the original object if keys input is not an array", () => {
    const inputObject = { a: 1, b: 2, c: 3 };
    const keysToDelete = "not an array";
    const result = deleteKeys(inputObject, keysToDelete);

    expect(result).toEqual(inputObject);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - generateRandomString", () => {
  // ----------------------------------------------------------------------------------------------

  const generateRandomString = utils.generateRandomString;

  // ----------------------------------------------------------------------------------------------

  it("generateRandomString should generate a random string with default parameters", () => {
    const result = generateRandomString();

    expect(result).toHaveLength(32);
    // Ensure that the result contains a mix of characters
    expect(/[a-zA-Z0-9!@#$%^&*-_+=;:,.<>?]+/.test(result)).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("generateRandomString should generate a random string with custom size", () => {
    const customSize = 20;
    const result = generateRandomString(customSize);

    expect(result).toHaveLength(customSize);
    // Ensure that the result contains a mix of characters
    expect(/[a-zA-Z0-9!@#$%^&*-_+=;:,.<>?]+/.test(result)).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("generateRandomString should generate a random string excluding lowercase characters", () => {
    const options = { excludeLowerCaseChars: true };
    const result = generateRandomString(64, options);

    expect(result).toHaveLength(64);
    // Ensure that the result contains only uppercase characters, digits, and symbols
    expect(
      "abcdefghijklmnopqrstuvwxyz"
        .split("")
        .every((value) => !result.includes(value))
    ).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("generateRandomString should generate a random string excluding uppercase characters", () => {
    const options = { excludeUpperCaseChars: true };
    const result = generateRandomString(64, options);

    expect(result).toHaveLength(64);
    // Ensure that the result contains only uppercase characters, digits, and symbols
    expect(
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        .split("")
        .every((value) => !result.includes(value))
    ).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("generateRandomString should generate a random string excluding accented chars characters", () => {
    const options = { excludeAccentedChars: true };
    const result = generateRandomString(64, options);

    expect(result).toHaveLength(64);
    // Ensure that the result contains only uppercase characters, digits, and symbols
    expect(
      "àáâãçèéêìíîðñòóôõùúûýú"
        .split("")
        .every((value) => !result.includes(value))
    ).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("generateRandomString should generate a random string excluding digits", () => {
    const options = { excludeDigits: true };
    const result = generateRandomString(64, options);

    expect(result).toHaveLength(64);
    // Ensure that the result contains only uppercase characters, digits, and symbols
    expect(
      "0123456789".split("").every((value) => !result.includes(value))
    ).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("generateRandomString should generate a random string excluding symbols", () => {
    const options = { excludeSymbols: true };
    const result = generateRandomString(64, options);

    expect(result).toHaveLength(64);
    // Ensure that the result contains only uppercase characters, digits, and symbols
    expect(
      "!@#$%^&*-_+=;:,.<>?".split("").every((value) => !result.includes(value))
    ).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("generateRandomString should generate a random string with custom symbols", () => {
    const customSymbols = "@#$%";
    const options = {
      includeSymbols: customSymbols,
      excludeLowerCaseChars: true,
      excludeUpperCaseChars: true,
      excludeAccentedChars: true,
      excludeSymbols: true,
    };
    const result = generateRandomString(64, options);
    expect(result).toHaveLength(64);
    expect(
      customSymbols.split("").some((value) => result.includes(value))
    ).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("generateRandomString should generate an empty string when excluding all character types", () => {
    const options = {
      excludeLowerCaseChars: true,
      excludeUpperCaseChars: true,
      excludeAccentedChars: true,
      excludeDigits: true,
      excludeSymbols: true,
    };
    const result = generateRandomString(32, options);

    expect(result).toHaveLength(0);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - generateSimpleId", () => {
  // ----------------------------------------------------------------------------------------------

  const generateSimpleId = utils.generateSimpleId;

  // ----------------------------------------------------------------------------------------------

  it("should generate a simple id with default separator", () => {
    const result = generateSimpleId("example");
    expect(result.includes("_")).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("should generate a simple id with a custom separator", () => {
    const customSeparator = "-";
    const result = generateSimpleId("example", customSeparator);
    expect(result.includes(customSeparator)).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("should generate a simple id with an empty input and default separator", () => {
    const result = generateSimpleId();
    expect(result.includes("_")).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("should generate a simple id with an empty input and not the default separator", () => {
    const result = generateSimpleId(undefined, "-");
    expect(result.includes("_")).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("should have a valid timestamp in the generated string", () => {
    const result = generateSimpleId("example");
    const timestampPart = result.split("_")[1];

    const currentTimestamp = Date.now();
    expect(Number(timestampPart)).toBeGreaterThan(currentTimestamp - 86400000); // 24 hours ago
    expect(Number(timestampPart)).toBeLessThan(currentTimestamp + 86400000); // 24 hours in the future
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - getExecutionTime", () => {
  // ----------------------------------------------------------------------------------------------

  const getExecutionTime = utils.getExecutionTime;

  // ----------------------------------------------------------------------------------------------

  it("getExecutionTime should return a non-negative value", () => {
    const time = process.hrtime();
    const result = parseFloat(getExecutionTime(time));
    expect(result).toBeGreaterThanOrEqual(0);
  });

  // ----------------------------------------------------------------------------------------------

  it("getExecutionTime should return a string", () => {
    const time = process.hrtime();
    const result = getExecutionTime(time);
    expect(typeof result).toBe("string");
  });

  // ----------------------------------------------------------------------------------------------

  it("getExecutionTime should return a value with three decimal places", () => {
    const time = process.hrtime();
    const result = getExecutionTime(time);
    const decimalPlaces = (result.split(".")[1] || "").length;
    expect(decimalPlaces).toBe(3);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - JSONFrom", () => {
  // ----------------------------------------------------------------------------------------------

  const JSONFrom = utils.JSONFrom;

  // ----------------------------------------------------------------------------------------------

  it("JSONFrom should return an object from a valid JSON string", () => {
    const jsonString = '{"key": "value", "number": 42}';
    const result = JSONFrom(jsonString);
    expect(result).toEqual({ key: "value", number: 42 });
  });

  // ----------------------------------------------------------------------------------------------

  it("JSONFrom should throw an error an empty string", () => {
    try {
      JSONFrom("");
    } catch (error) {
      expect(error.message).toBe("Unexpected end of JSON input");
    }
  });

  // ----------------------------------------------------------------------------------------------

  it("JSONFrom should throw an error for an invalid JSON string when throwsError is true", () => {
    const invalidJsonString = '{"key": "value", "missingQuotes: "invalid}';
    expect(() => JSONFrom(invalidJsonString)).toThrow();
  });

  // ----------------------------------------------------------------------------------------------

  it("JSONFrom should return null for an invalid JSON string when throwsError is false", () => {
    const invalidJsonString = '{"key": "value", "missingQuotes: "invalid}';
    const result = JSONFrom(invalidJsonString, false);
    expect(result).toBeNull();
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - JSONTo", () => {
  // ----------------------------------------------------------------------------------------------

  const JSONTo = utils.JSONTo;

  // ----------------------------------------------------------------------------------------------

  it("JSONTo should return a JSON string for a valid object", () => {
    const inputObject = { key: "value", number: 42 };
    const result = JSONTo(inputObject);
    expect(result).toBe('{"key":"value","number":42}');
  });

  // ----------------------------------------------------------------------------------------------

  it("JSONTo should return an empty object for an undefined object", () => {
    const result = JSONTo(undefined);
    expect(result).toBe("{}");
  });

  // ----------------------------------------------------------------------------------------------

  it("JSONTo should throw an error for a circular object when throwsError is true", () => {
    const circularObject = { key: "value" };
    circularObject.circularReference = circularObject;
    expect(() => JSONTo(circularObject)).toThrow();
  });

  // ----------------------------------------------------------------------------------------------

  it("JSONTo should return null for a circular object when throwsError is false", () => {
    const circularObject = { key: "value" };
    circularObject.circularReference = circularObject;
    const result = JSONTo(circularObject, false);
    expect(result).toBe(null);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - normalize", () => {
  // ----------------------------------------------------------------------------------------------

  const normalize = utils.normalize;

  // ----------------------------------------------------------------------------------------------

  it("normalize should return a normalized string for a valid text", () => {
    const inputText = "héllö wôrld";
    const result = normalize(inputText);
    expect(result).toBe("hello world");
  });

  // ----------------------------------------------------------------------------------------------

  it("normalize should return an empty string for an undefined text", () => {
    const result = normalize(undefined);
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("normalize should return an empty string for an object", () => {
    const result = normalize({});
    expect(result).toBeInstanceOf(Object);
  });

  // ----------------------------------------------------------------------------------------------

  it("normalize should return a number string for a value", () => {
    const result = normalize(123);
    expect(result).toBe("123");
  });

  // ----------------------------------------------------------------------------------------------

  it("normalize should handle an empty string input", () => {
    const result = normalize("");
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("normalize should handle a string with only accents", () => {
    const inputText = "éèê";
    const result = normalize(inputText);
    expect(result).toBe("eee");
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - messageEncryptToChunks", () => {
  // ----------------------------------------------------------------------------------------------

  const PUBLIC_KEY = fs.readFileSync("./keys/public_key.pem", "utf8");
  const messageEncryptToChunks = utils.messageEncryptToChunks;

  // ----------------------------------------------------------------------------------------------

  it("messageEncryptToChunks - Encrypts a short message with default chunk size", async () => {
    const message = "Hello, world!";
    const encryptedChunks = await messageEncryptToChunks(PUBLIC_KEY, message);
    expect(encryptedChunks).toBeTruthy();
  });

  // ----------------------------------------------------------------------------------------------

  it("messageEncryptToChunks - Encrypts a long message with custom chunk size", async () => {
    const longMessage = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;
    const encryptedChunks = await messageEncryptToChunks(
      PUBLIC_KEY,
      longMessage,
      { chunkSize: 190 }
    );
    expect(encryptedChunks).toBeTruthy();
  });

  // ----------------------------------------------------------------------------------------------

  it("messageEncryptToChunks - Throws error for invalid public key", async () => {
    const message = "Hello, world!";
    const publicKey = "INVALID_PUBLIC_KEY";

    try {
      await messageEncryptToChunks(publicKey, message);
    } catch (error) {
      expect(error.message).toBe("Invalid keyData");
    }
  });

  // ----------------------------------------------------------------------------------------------

  it("messageEncryptToChunks - Returns empty string for empty message", async () => {
    const encryptedChunks = await messageEncryptToChunks(PUBLIC_KEY, "");
    expect(encryptedChunks).to.be.an("array").that.is.empty;
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - messageDecryptFromChunks", () => {
  // ----------------------------------------------------------------------------------------------

  const PUBLIC_KEY = fs.readFileSync("./keys/public_key.pem", "utf8");
  const PRIVATE_KEY = fs.readFileSync("./keys/private_key.pem", "utf8");
  const messageDecryptFromChunks = utils.messageDecryptFromChunks;
  const messageEncryptToChunks = utils.messageEncryptToChunks;

  // ----------------------------------------------------------------------------------------------

  it("messageDecryptFromChunks - Returns empty string for empty messageChunks", async () => {
    const result = await messageDecryptFromChunks(PRIVATE_KEY, []);
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("messageDecryptFromChunks - Throws error for invalid private key format", async () => {
    try {
      await messageDecryptFromChunks("invalid_private_key", [
        "chunk1",
        "chunk2",
      ]);
    } catch (error) {
      expect(error.message).toBe("Invalid keyData");
    }
  });

  // ----------------------------------------------------------------------------------------------

  it("messageDecryptFromChunks - Decrypt the message correctly", async () => {
    const message = "Hello, world! à ã ü ñ ° ª";
    const encryptedChunks = await messageEncryptToChunks(PUBLIC_KEY, message);
    const decrypted = await messageDecryptFromChunks(
      PRIVATE_KEY,
      encryptedChunks
    );

    expect(decrypted).toEqual(message);
  });

  // ----------------------------------------------------------------------------------------------

  it("messageDecryptFromChunks - Calls privateKeyFromPem with correct parameters but with different public keys", async () => {
    const PUBLIC_KEY2 = fs.readFileSync("./keys/public_key2.pem", "utf8");
    const message = "Hello, world!";
    try {
      const encryptedChunks = await messageEncryptToChunks(
        PUBLIC_KEY2,
        message
      );
      await messageDecryptFromChunks(PRIVATE_KEY, encryptedChunks);
    } catch (error) {
      expect(error.message).toBe(
        "The operation failed for an operation-specific reason"
      );
    }
  });

  // ----------------------------------------------------------------------------------------------

  it("messageDecryptFromChunks - Encrypt a long message with chunk size greater than allowed", async () => {
    try {
      const encryptedChunks = await messageEncryptToChunks(
        PUBLIC_KEY,
        jsonTest,
        { chunkSize: 300 }
      );
      await messageDecryptFromChunks(PRIVATE_KEY, encryptedChunks);
    } catch (error) {
      expect(error.message).toBe(
        "The operation failed for an operation-specific reason"
      );
    }
  });

  // ----------------------------------------------------------------------------------------------

  it("messageDecryptFromChunks - Encrypt a long message with chunk size equal to allowed", async () => {
    const encryptedChunks = await messageEncryptToChunks(PUBLIC_KEY, jsonTest);

    const decrypted = await messageDecryptFromChunks(
      PRIVATE_KEY,
      encryptedChunks
    );

    expect(decrypted).toEqual(jsonTest);
  });

  // ----------------------------------------------------------------------------------------------

  it("messageDecryptFromChunks - Encrypt a long message WITH ACCENTS", async () => {
    // Adicione isso no topo do seu describe
    const jsonTestComAcentos = JSON.stringify({
      user: "José da Silva",
      description:
        "Operação com acentuação e caracteres especiais para teste: ç, ã, é.",
      data: "a".repeat(500), // para garantir que seja uma mensagem longa
    });
    const encryptedChunks = await messageEncryptToChunks(
      PUBLIC_KEY,
      jsonTestComAcentos
    );

    const decrypted = await messageDecryptFromChunks(
      PRIVATE_KEY,
      encryptedChunks
    );

    expect(decrypted).toEqual(jsonTestComAcentos);
  });
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - regexDigitsOnly", () => {
  // ----------------------------------------------------------------------------------------------

  const regexDigitsOnly = utils.regexDigitsOnly;

  // ----------------------------------------------------------------------------------------------

  it("regexDigitsOnly should return only digits for a valid text", () => {
    const inputText = "abc123xyz456";
    const result = regexDigitsOnly(inputText);
    expect(result).toBe("123456");
  });

  // ----------------------------------------------------------------------------------------------

  it("regexDigitsOnly should return an empty string for an undefined text", () => {
    const result = regexDigitsOnly(undefined);
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("regexDigitsOnly should return an empty string for an object", () => {
    const result = regexDigitsOnly({});
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("regexDigitsOnly should return a string with a number for a number", () => {
    const result = regexDigitsOnly(123);
    expect(result).toBe("123");
  });

  // ----------------------------------------------------------------------------------------------

  it("regexDigitsOnly should handle an empty string input", () => {
    const result = regexDigitsOnly("");
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("regexDigitsOnly should return only digits for a string with mixed characters", () => {
    const inputText = "!@#$%^12345&*()6789";
    const result = regexDigitsOnly(inputText);
    expect(result).toBe("123456789");
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - regexReplaceTrim", () => {
  // ----------------------------------------------------------------------------------------------

  const regexReplaceTrim = utils.regexReplaceTrim;

  // ----------------------------------------------------------------------------------------------

  it("regexReplaceTrim should replace characters outside the specified regex with the replacement", () => {
    const inputText = "A1B2C3";
    const result = regexReplaceTrim(inputText, "A-Za-z0-9", "-");
    expect(result).toBe("A1B2C3");
  });

  // ----------------------------------------------------------------------------------------------

  it("regexReplaceTrim should trim the resulting string", () => {
    const inputText = "   A B C   ";
    const result = regexReplaceTrim(inputText, "A-Z", "");
    expect(result).toBe("ABC");
  });

  // ----------------------------------------------------------------------------------------------

  it("regexReplaceTrim should handle an empty string input", () => {
    const result = regexReplaceTrim("", "A-Za-z0-9", "");
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("regexReplaceTrim should handle an undefined input", () => {
    const result = regexReplaceTrim(undefined, "A-Za-z0-9", "");
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("regexReplaceTrim should correctly replace characters outside the specified regex with the replacement", () => {
    const inputText = "Hello! @123 World 456";
    const result = regexReplaceTrim(inputText, "A-Za-z0-9", "*");
    expect(result).toBe("Hello***123*World*456");
  });

  // ----------------------------------------------------------------------------------------------

  it("regexReplaceTrim should handle special characters in the regex", () => {
    const inputText = "Alpha!@Beta?Gamma#$Delta";
    const result = regexReplaceTrim(inputText, "!@#$%", "");
    expect(result).toBe("!@#$");
  });

  // ----------------------------------------------------------------------------------------------

  it("regexReplaceTrim should handle multi-word strings", () => {
    const inputText = "  One Two Three   ";
    const result = regexReplaceTrim(inputText, "A-Za-z", "_");
    expect(result).toBe("__One_Two_Three___");
  });

  // ----------------------------------------------------------------------------------------------

  it("regexReplaceTrim should handle a complex regex pattern", () => {
    const inputText = "123-abc_456-xyz@789";
    const result = regexReplaceTrim(inputText, "a-z@", "");
    expect(result).toBe("abcxyz@");
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - regexLettersOnly", () => {
  // ----------------------------------------------------------------------------------------------

  const regexLettersOnly = utils.regexLettersOnly;

  // ----------------------------------------------------------------------------------------------

  it("regexLettersOnly should remove non-letter characters", () => {
    const inputText = "Hello123 World!456";
    const result = regexLettersOnly(inputText);
    expect(result).toBe("HelloWorld");
  });

  // ----------------------------------------------------------------------------------------------

  it("regexLettersOnly should handle special characters", () => {
    const inputText = "Alpha!@Beta?Gamma#$Delta";
    const result = regexLettersOnly(inputText);
    expect(result).toBe("AlphaBetaGammaDelta");
  });

  // ----------------------------------------------------------------------------------------------

  it("regexLettersOnly should handle multi-word strings", () => {
    const inputText = "  One Two Three   ";
    const result = regexLettersOnly(inputText);
    expect(result).toBe("OneTwoThree");
  });

  // ----------------------------------------------------------------------------------------------

  it("regexLettersOnly should handle accented characters", () => {
    const inputText = "Café crème";
    const result = regexLettersOnly(inputText);
    expect(result).toBe("Cafécrème");
  });

  // ----------------------------------------------------------------------------------------------

  it("regexLettersOnly should handle uppercase and lowercase letters", () => {
    const inputText = "AbC XyZ";
    const result = regexLettersOnly(inputText);
    expect(result).toBe("AbCXyZ");
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - removeDuplicatedStrings", () => {
  // ----------------------------------------------------------------------------------------------

  const removeDuplicatedStrings = utils.removeDuplicatedStrings;

  // ----------------------------------------------------------------------------------------------

  it("removeDuplicatedStrings should remove duplicated strings", () => {
    const inputText = "apple orange banana apple mango banana";
    const result = removeDuplicatedStrings(inputText, " ");
    expect(result).toBe("apple orange banana mango");
  });

  // ----------------------------------------------------------------------------------------------

  it("removeDuplicatedStrings should remove case-insensitive duplicated strings", () => {
    const inputText = "apple orange Banana apple Mango Banana";
    const result = removeDuplicatedStrings(inputText, " ", true);
    expect(result).toBe("orange apple Mango Banana");
  });

  // ----------------------------------------------------------------------------------------------

  it("removeDuplicatedStrings should handle case-sensitive duplicated strings", () => {
    const inputText = "apple orange Banana apple Mango Banana";
    const result = removeDuplicatedStrings(inputText, " ", false);
    expect(result).toBe("apple orange Banana Mango");
  });

  // ----------------------------------------------------------------------------------------------

  it("removeDuplicatedStrings should handle case-insensitivity with different split string characters", () => {
    const inputText = "Apple,Orange,Banana,apple,Mango,Banana";
    const result = removeDuplicatedStrings(inputText, ",", true);
    expect(result).toBe("Orange,apple,Mango,Banana");
  });

  // ----------------------------------------------------------------------------------------------

  it("removeDuplicatedStrings should handle different split string characters", () => {
    const inputText = "apple,orange,banana,apple,mango,banana";
    const result = removeDuplicatedStrings(inputText, ",");
    expect(result).toBe("apple,orange,banana,mango");
  });

  // ----------------------------------------------------------------------------------------------

  it("removeDuplicatedStrings should handle case-insensitivity", () => {
    const inputText = "Apple Orange apple ORANGE";
    const result = removeDuplicatedStrings(inputText, " ", true);
    expect(result).toBe("apple ORANGE");
  });

  // ----------------------------------------------------------------------------------------------

  it("removeDuplicatedStrings should handle leading and trailing spaces", () => {
    const inputText = "   cat   dog   cat   ";
    const result = removeDuplicatedStrings(inputText, " ");
    expect(result).toBe("cat dog");
  });

  // ----------------------------------------------------------------------------------------------

  it("removeDuplicatedStrings should handle an empty string", () => {
    const inputText = "";
    const result = removeDuplicatedStrings(inputText, ",");
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("removeDuplicatedStrings should handle an object string", () => {
    const result = removeDuplicatedStrings({}, ",");
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("removeDuplicatedStrings should handle an number", () => {
    const result = removeDuplicatedStrings(123, ",");
    expect(result).toBe("123");
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - sleep", () => {
  // ----------------------------------------------------------------------------------------------

  const sleep = utils.sleep;

  // ----------------------------------------------------------------------------------------------

  it("sleep - should resolve with the default returnValue after the specified delay", async () => {
    const start = Date.now();
    const returnValue = await sleep(100);
    const end = Date.now();

    expect(returnValue).toBe(true);
    expect(end - start).toBeGreaterThanOrEqual(95);
  });

  // ----------------------------------------------------------------------------------------------

  it("sleep - should resolve with the specified returnValue after the specified delay", async () => {
    const start = Date.now();
    const returnValue = await sleep(100, "Hello");
    const end = Date.now();

    expect(returnValue).toBe("Hello");
    expect(end - start).toBeGreaterThanOrEqual(95);
  });

  // ----------------------------------------------------------------------------------------------

  it("sleep - should reject with the default error after the specified delay if throwError is true", async () => {
    const start = Date.now();
    try {
      await sleep(100, true, true);
    } catch (error) {
      const end = Date.now();
      expect(error).toEqual(new Error("Sleep Error"));
      expect(end - start).toBeGreaterThanOrEqual(95);
    }
  });

  // ----------------------------------------------------------------------------------------------

  it("sleep - should reject with the specified returnValue after the specified delay if throwError is true", async () => {
    const start = Date.now();
    try {
      await sleep(100, "Oops!", true);
    } catch (error) {
      const end = Date.now();
      expect(error).toBe("Oops!");
      expect(end - start).toBeGreaterThanOrEqual(95);
    }
  });

  // ----------------------------------------------------------------------------------------------

  it("sleep - should resolve immediately if milliseconds is 0", async () => {
    const start = Date.now();
    const returnValue = await sleep(0);
    const end = Date.now();

    expect(returnValue).toBe(true);
    expect(end - start).toBeLessThan(10); // Allow a small buffer for execution time
  });

  // ----------------------------------------------------------------------------------------------

  it("sleep - should reject immediately if milliseconds is 0 and throwError is true", async () => {
    const start = Date.now();
    try {
      await sleep(0, "Immediate error", true);
    } catch (error) {
      const end = Date.now();
      expect(error).toBe("Immediate error");
      expect(end - start).toBeLessThan(10); // Allow a small buffer for execution time
    }
  });
  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - stringCompress", () => {
  // ----------------------------------------------------------------------------------------------

  const stringCompress = utils.stringCompress;

  // ----------------------------------------------------------------------------------------------

  it("deve comprimir uma string para o formato Base64 por padrão", () => {
    const text = "Este é um teste de compressão.";
    const result = stringCompress(text);

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
    // Verifica se a string parece ser Base64 válida
    expect(
      /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
        result
      )
    ).toBe(true);
  });

  it("deve retornar um Uint8Array quando outputType for 'buffer'", () => {
    const text = "Este é um teste de buffer.";
    const result = stringCompress(text, { outputType: "buffer" });

    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBeGreaterThan(0);
  });

  it("deve lidar corretamente com caracteres unicode e multi-byte", () => {
    const text = "Compressão com acentuação e emojis 👋 & ✅";
    const result = stringCompress(text);

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("deve retornar uma string vazia para entrada de string vazia", () => {
    expect(stringCompress("")).toBe("");
  });

  it("deve retornar um Uint8Array vazio para entrada vazia com outputType 'buffer'", () => {
    const result = stringCompress("", { outputType: "buffer" });
    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBe(0);
  });

  it("deve lidar com entradas nulas, indefinidas ou que não são strings", () => {
    expect(stringCompress(null)).toBe("");
    expect(stringCompress(undefined)).toBe("");
    expect(stringCompress(12345)).toBe("");
  });

  it("deve usar diferentes níveis de compressão e gerar resultados diferentes", () => {
    const text =
      "texto repetitivo texto repetitivo texto repetitivo texto repetitivo texto repetitivo";
    const resultNivel1 = stringCompress(text, { level: 1 });
    const resultNivel9 = stringCompress(text, { level: 9 });

    expect(resultNivel1).not.toBe(resultNivel9);
    // Um nível de compressão maior deve resultar em um tamanho menor ou igual
    expect(resultNivel9.length).toBeLessThanOrEqual(resultNivel1.length);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - stringDecompress", () => {
  // ----------------------------------------------------------------------------------------------

  const stringCompress = utils.stringCompress;
  const stringDecompress = utils.stringDecompress;

  // ----------------------------------------------------------------------------------------------

  it("deve descomprimir uma string Base64 de volta para o texto original (ciclo completo)", () => {
    const originalText =
      "Este é um teste completo de compressão e descompressão!";
    const compressed = stringCompress(originalText);
    const decompressed = stringDecompress(compressed);
    expect(decompressed).toBe(originalText);
  });

  it("deve realizar um ciclo completo com caracteres unicode", () => {
    const originalText =
      "Teste com acentuação (áéíóú) e símbolos complexos (👋 & ✅)";
    const compressed = stringCompress(originalText);
    const decompressed = stringDecompress(compressed);
    expect(decompressed).toBe(originalText);
  });

  it("deve realizar um ciclo completo usando buffers como formato intermediário", () => {
    const originalText = "Ciclo completo de buffer para buffer";
    const compressedBuffer = stringCompress(originalText, {
      outputType: "buffer",
    });
    const decompressed = stringDecompress(compressedBuffer, {
      inputType: "buffer",
    });
    expect(decompressed).toBe(originalText);
  });

  it("deve funcionar independentemente do nível de compressão usado", () => {
    const originalText = "Testando com nível de compressão 9";
    const compressed = stringCompress(originalText, { level: 9 });
    const decompressed = stringDecompress(compressed);
    expect(decompressed).toBe(originalText);
  });

  it("deve retornar uma string vazia para entrada vazia ou nula", () => {
    expect(stringDecompress("")).toBe("");
    expect(stringDecompress(null)).toBe("");
    expect(stringDecompress(undefined)).toBe("");
  });

  it("deve retornar uma string vazia para dados Base64 corrompidos", () => {
    const corruptBase64 = "isto nao e base64 valida";
    expect(stringDecompress(corruptBase64)).toBe("");
  });

  it("deve retornar uma string vazia para um buffer corrompido", () => {
    const corruptBuffer = new Uint8Array([1, 2, 3, 4, 5]);
    const result = stringDecompress(corruptBuffer, { inputType: "buffer" });
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - stringToDate", () => {
  // ----------------------------------------------------------------------------------------------

  const stringToDate = utils.stringToDate;

  // ----------------------------------------------------------------------------------------------

  it("stringToDate should parse a valid date string with default format", () => {
    const dateString = "2023-12-22T12:34:56.789";
    const result = stringToDate(dateString);
    expect(result instanceof Date).toBe(true);
    expect(result.toGMTString()).toBe("Fri, 22 Dec 2023 12:34:56 GMT");
  });

  // ----------------------------------------------------------------------------------------------

  it("stringToDate should parse a valid date string with default format with timezone format", () => {
    const dateString = "2023-12-22T12:34:56.789Z";
    const result = stringToDate(dateString, constants.DATE_ISO_FORMAT_TZ);
    expect(result instanceof Date).toBe(true);
    expect(result.toGMTString()).toBe("Fri, 22 Dec 2023 12:34:56 GMT");
  });

  // ----------------------------------------------------------------------------------------------

  it("stringToDate should parse a valid date string with custom format", () => {
    const dateString = "22-12-2023";
    const customFormat = "dd-MM-yyyy";
    const result = stringToDate(dateString, customFormat);
    expect(result instanceof Date).toBe(true);
    expect(result.toGMTString()).toBe("Fri, 22 Dec 2023 00:00:00 GMT");
  });

  // ----------------------------------------------------------------------------------------------

  it("stringToDate should parse a valid date string with custom incomplete format", () => {
    const dateString = "12-07-2022";
    const result = stringToDate(dateString, constants.DATE_BR_FORMAT_D);
    expect(result instanceof Date).toBe(true);
    expect(result.toGMTString()).toBe("Tue, 12 Jul 2022 00:00:00 GMT");
  });

  // ----------------------------------------------------------------------------------------------

  it("stringToDate should return default date for an invalid date string with default format", () => {
    const invalidDateString = "invalid-date";
    const defaultDate = new Date(2022, 0, 1);
    const result = stringToDate(invalidDateString, undefined, defaultDate);
    expect(result instanceof Date).toBe(true);
    expect(result.toGMTString()).toBe("Sat, 01 Jan 2022 00:00:00 GMT");
  });

  // ----------------------------------------------------------------------------------------------

  it("stringToDate should return default date for an invalid date string with custom format", () => {
    const invalidDateString = "invalid-date";
    const customFormat = "dd-MM-yyyy";
    const defaultDate = new Date(2022, 0, 1);
    const result = stringToDate(invalidDateString, customFormat, defaultDate);
    expect(result instanceof Date).toBe(true);
    expect(result.toGMTString()).toBe("Sat, 01 Jan 2022 00:00:00 GMT");
  });

  // ----------------------------------------------------------------------------------------------

  it("stringToDate should return default date as false for an invalid date string with custom format", () => {
    const invalidDateString = "invalid-date";
    const customFormat = "dd-MM-yyyy";
    const result = stringToDate(invalidDateString, customFormat, false);
    expect(result).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - stringToDateToFormat", () => {
  // ----------------------------------------------------------------------------------------------

  const stringToDateToFormat = utils.stringToDateToFormat;

  // ----------------------------------------------------------------------------------------------

  it("should return a formatted date string in the default format", () => {
    const inputDateString = "2022-01-15T12:34:56.789";
    const result = stringToDateToFormat(inputDateString);
    expect(result).toEqual("15-01-2022 12:34:56");
  });

  // ----------------------------------------------------------------------------------------------

  it("should return a formatted date string from a custom format", () => {
    const inputDateString = "02-05-2021";
    const result = stringToDateToFormat(
      inputDateString,
      constants.DATE_BR_FORMAT_D,
      constants.DATE_BR_MONTH_FORMAT_FS
    );
    expect(result).toEqual("05/2021");
  });

  // ----------------------------------------------------------------------------------------------

  it("should return a formatted date string in the specified format", () => {
    const inputDateString = "2022-12-22T12:34:56.789";
    const result = stringToDateToFormat(
      inputDateString,
      constants.DATE_ISO_FORMAT,
      constants.DATE_BR_FORMAT_D
    );
    expect(result).toEqual("22-12-2022");
  });

  // ----------------------------------------------------------------------------------------------

  it("should return false for an invalid date string", () => {
    const invalidDateString = "invalid-date-string";
    const result = stringToDateToFormat(invalidDateString);
    expect(result).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("should return false for a valid date string but invalid format", () => {
    const inputDateString = "2022-12-22T12:34:56.789Z";
    const invalidFormat = "invalid-format";
    const result = stringToDateToFormat(
      inputDateString,
      constants.DATE_ISO_FORMAT,
      invalidFormat
    );
    expect(result).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - stringToFormat", () => {
  // ----------------------------------------------------------------------------------------------

  const stringToFormat = utils.stringToFormat;

  // ----------------------------------------------------------------------------------------------

  it("should return a formatted string with the default pattern", () => {
    const inputText = "12345678901234";
    const result = stringToFormat(inputText);
    expect(result).toBe("12.345.678/9012-34");
  });

  // ----------------------------------------------------------------------------------------------

  it("should return a formatted string with the specified pattern", () => {
    const inputText = "12345678901234";
    const customPattern = "###-###-###";
    const result = stringToFormat(inputText, customPattern);
    expect(result).toBe("123-456-789");
  });

  // ----------------------------------------------------------------------------------------------

  it("should pad the input text with zeros if it is shorter than the pattern", () => {
    const inputText = "123400";
    const result = stringToFormat(inputText);
    expect(result).toBe("00.000.000/1234-00");
  });

  // ----------------------------------------------------------------------------------------------

  it("should ignore extra digits if the input text is longer than the pattern", () => {
    const inputText = "12345678901234567890";
    const result = stringToFormat(inputText);
    expect(result).toBe("12.345.678/9012-34");
  });

  // ----------------------------------------------------------------------------------------------

  it("should handle an empty input text", () => {
    const result = stringToFormat("");
    expect(result).toBe("00.000.000/0000-00");
  });

  // ----------------------------------------------------------------------------------------------

  it("should return a formatted string with the default pattern and options", () => {
    const inputText = "12345678901234";
    const result = stringToFormat(inputText);
    expect(result).toBe("12.345.678/9012-34");
  });

  // ----------------------------------------------------------------------------------------------

  it("should return a formatted string with the specified pattern and options", () => {
    const inputText = "12345678901234";
    const customPattern = "###-###-###";
    const options = { digitsOnly: true, paddingChar: "X" };
    const result = stringToFormat(inputText, customPattern, options);
    expect(result).toBe("123-456-789");
  });

  // ----------------------------------------------------------------------------------------------

  it("should pad the input text if it is shorter than the pattern and apply custom padding char", () => {
    const inputText = "1234";
    const options = { digitsOnly: true, paddingChar: "9" };
    const result = stringToFormat(inputText, undefined, options);
    expect(result).toBe("99.999.999/9912-34");
  });

  // ----------------------------------------------------------------------------------------------

  it("should handle an empty input text and apply custom padding char", () => {
    const options = { digitsOnly: true, paddingChar: "7" };
    const result = stringToFormat("", undefined, options);
    expect(result).toBe("77.777.777/7777-77");
  });

  // ----------------------------------------------------------------------------------------------

  it("should handle a undefined text", () => {
    const options = { digitsOnly: true, paddingChar: "X" };
    const result = stringToFormat(undefined, "XXX.XXX.XXX-XX", options);
    expect(result).toBe("XXX.XXX.XXX-XX");
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - stringZLibCompress", () => {
  // ----------------------------------------------------------------------------------------------

  const stringZLibCompress = utils.stringZLibCompress;

  // ----------------------------------------------------------------------------------------------

  it("deve comprimir uma string com Zlib para o formato Base64 por padrão", () => {
    const text = "Este é um teste de compressão Zlib.";
    const result = stringZLibCompress(text);

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
    // Verifica se a string parece ser Base64 válida
    expect(
      /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
        result
      )
    ).toBe(true);
  });

  it("deve retornar um Uint8Array quando outputType for 'buffer'", () => {
    const text = "Este é um teste de buffer com Zlib.";
    const result = stringZLibCompress(text, { outputType: "buffer" });

    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBeGreaterThan(0);
  });

  it("deve lidar corretamente com caracteres unicode e multi-byte", () => {
    const text = "Compressão Zlib com acentuação e emojis 👋 & ✅";
    const result = stringZLibCompress(text);

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("deve retornar uma string vazia para entrada de string vazia", () => {
    expect(stringZLibCompress("")).toBe("");
  });

  it("deve retornar um Uint8Array vazio para entrada vazia com outputType 'buffer'", () => {
    const result = stringZLibCompress("", { outputType: "buffer" });
    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBe(0);
  });

  it("deve lidar com entradas nulas, indefinidas ou que não são strings", () => {
    expect(stringZLibCompress(null)).toBe("");
    expect(stringZLibCompress(undefined)).toBe("");
    expect(stringZLibCompress(12345)).toBe("");
  });

  it("deve usar diferentes níveis de compressão e gerar resultados diferentes", () => {
    const text =
      "zlib repetitivo zlib repetitivo zlib repetitivo zlib repetitivo zlib repetitivo";
    const resultNivel1 = stringZLibCompress(text, { level: 1 });
    const resultNivel9 = stringZLibCompress(text, { level: 9 });

    expect(resultNivel1).not.toBe(resultNivel9);
    // Um nível de compressão maior deve resultar em um tamanho menor ou igual
    expect(resultNivel9.length).toBeLessThanOrEqual(resultNivel1.length);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - stringZLibDecompress", () => {
  // ----------------------------------------------------------------------------------------------

  const stringZLibCompress = utils.stringZLibCompress;
  const stringZLibDecompress = utils.stringZLibDecompress;

  // ----------------------------------------------------------------------------------------------

  it("deve descomprimir uma string Base64 (Zlib) de volta para o texto original", () => {
    const originalText =
      "Este é um teste completo de compressão e descompressão Zlib!";
    const compressed = stringZLibCompress(originalText);
    const decompressed = stringZLibDecompress(compressed);
    expect(decompressed).toBe(originalText);
  });

  it("deve realizar um ciclo completo com caracteres unicode", () => {
    const originalText =
      "Teste Zlib com acentuação (áéíóú) e símbolos complexos (👋 & ✅)";
    const compressed = stringZLibCompress(originalText);
    const decompressed = stringZLibDecompress(compressed);
    expect(decompressed).toBe(originalText);
  });

  it("deve realizar um ciclo completo usando buffers como formato intermediário", () => {
    const originalText = "Ciclo completo Zlib: de buffer para buffer";
    const compressedBuffer = stringZLibCompress(originalText, {
      outputType: "buffer",
    });
    const decompressed = stringZLibDecompress(compressedBuffer, {
      inputType: "buffer",
    });
    expect(decompressed).toBe(originalText);
  });

  it("deve funcionar independentemente do nível de compressão usado", () => {
    const originalText = "Testando Zlib com nível de compressão 9";
    const compressed = stringZLibCompress(originalText, { level: 9 });
    const decompressed = stringZLibDecompress(compressed);
    expect(decompressed).toBe(originalText);
  });

  it("deve retornar uma string vazia para entrada vazia ou nula", () => {
    expect(stringZLibDecompress("")).toBe("");
    expect(stringZLibDecompress(null)).toBe("");
    expect(stringZLibDecompress(undefined)).toBe("");
  });

  it("deve retornar uma string vazia para dados Base64 corrompidos", () => {
    const corruptBase64 = "isto nao e base64 valida para zlib";
    expect(stringZLibDecompress(corruptBase64)).toBe("");
  });

  it("deve retornar uma string vazia para um buffer corrompido", () => {
    const corruptBuffer = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
    const result = stringZLibDecompress(corruptBuffer, { inputType: "buffer" });
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - throttle", () => {
  // ----------------------------------------------------------------------------------------------

  const throttle = utils.throttle;
  const sleep = utils.sleep;
  let vi; // Mocking utility from vitest/jest

  beforeEach(() => {
    // Para ambientes de teste como Vitest/Jest
    vi = global.vi || global.jest;
    vi.useFakeTimers(); // Usa timers falsos para controlar o tempo com precisão
  });

  afterEach(() => {
    vi.useRealTimers(); // Restaura os timers reais após cada teste
  });

  // ----------------------------------------------------------------------------------------------

  it("deve executar o callback imediatamente na primeira chamada", () => {
    const mockCallback = vi.fn();
    const throttledFn = throttle(mockCallback, 100);

    throttledFn();

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it("deve ignorar chamadas subsequentes dentro do período de espera", () => {
    const mockCallback = vi.fn();
    const throttledFn = throttle(mockCallback, 100);

    throttledFn(); // Executa
    throttledFn(); // Ignorada
    throttledFn(); // Ignorada

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it("deve executar novamente após o período de espera ter passado", () => {
    const mockCallback = vi.fn();
    const throttledFn = throttle(mockCallback, 100);

    throttledFn();
    expect(mockCallback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(50);
    throttledFn();
    expect(mockCallback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(50);
    throttledFn();
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });

  it("deve passar os argumentos corretamente para o callback", () => {
    const mockCallback = vi.fn();
    const throttledFn = throttle(mockCallback, 100);
    const args = [1, "teste", { data: true }];

    throttledFn(...args);

    expect(mockCallback).toHaveBeenCalledWith(...args);
  });

  it("deve preservar o contexto 'this' corretamente", () => {
    const mockCallback = vi.fn();
    const context = { name: "meuObjeto" };
    const throttledFn = throttle(mockCallback, 100);

    throttledFn.call(context);

    // CORREÇÃO: Acessa o array de contextos da chamada mock e verifica o primeiro.
    // Esta é a forma padrão de verificar o `this` em mocks do Vitest/Jest.
    expect(mockCallback.mock.contexts[0]).toBe(context);
  });

  it("deve lançar um erro se o callback não for uma função", () => {
    const createInvalidThrottle = () => throttle("não é uma função", 100);

    expect(createInvalidThrottle).toThrow(TypeError);
    expect(createInvalidThrottle).toThrow(
      "O callback fornecido para o throttle deve ser uma função."
    );
  });

  it("deve lançar um erro se o tempo de espera não for um número", () => {
    const createInvalidThrottle = () => throttle(() => {}, "100");

    expect(createInvalidThrottle).toThrow(TypeError);
    // CORREÇÃO: Atualiza a mensagem de erro para corresponder à validação mais robusta da função.
    expect(createInvalidThrottle).toThrow(
      "O tempo de espera (wait) do throttle deve ser um número não negativo."
    );
  });

  it("deve permitir uma nova chamada após uma chamada anterior e um ciclo completo de espera", () => {
    const mockCallback = vi.fn();
    const throttledFn = throttle(mockCallback, 100);

    throttledFn(1);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(1);

    vi.advanceTimersByTime(101);

    throttledFn(2);
    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(mockCallback).toHaveBeenLastCalledWith(2);
  });

  // ----------------------------------------------------------------------------------------------
});
// ------------------------------------------------------------------------------------------------

describe("UTILS - toString", () => {
  // ----------------------------------------------------------------------------------------------

  const toString = utils.toString;

  // ----------------------------------------------------------------------------------------------

  it("should return an empty string for undefined input", () => {
    const result = toString();
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("should return the same string for a string input", () => {
    const inputText = "Hello, World!";
    const result = toString(inputText);
    expect(result).toBe(inputText);
  });

  // ----------------------------------------------------------------------------------------------

  it("should convert a number to a string", () => {
    const inputNumber = 42;
    const result = toString(inputNumber);
    expect(result).toBe("42");
  });

  // ----------------------------------------------------------------------------------------------

  it("should convert a boolean to a string", () => {
    const inputBoolean = true;
    const result = toString(inputBoolean);
    expect(result).toBe("true");
  });

  // ----------------------------------------------------------------------------------------------

  it("should use toString method for custom objects", () => {
    const customObject = {
      toString: () => "Custom Object",
    };
    const result = toString(customObject);
    expect(result).toBe("Custom Object");
  });

  // ----------------------------------------------------------------------------------------------

  it("should convert null to an empty string", () => {
    const inputNull = null;
    const result = toString(inputNull);
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("should convert undefined to an empty string", () => {
    const inputUndefined = undefined;
    const result = toString(inputUndefined);
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("should convert symbols to a string", () => {
    const inputSymbol = Symbol("test");
    const result = toString(inputSymbol);
    expect(result).toBe("Symbol(test)");
  });

  // ----------------------------------------------------------------------------------------------

  it("should use toString method for custom objects", () => {
    const customObject = {
      a: 2,
      b: "text",
      c: { x: "test" },
    };
    const result = toString(customObject);
    expect(result).toBe('{"a":2,"b":"text","c":{"x":"test"}}');
  });

  // ----------------------------------------------------------------------------------------------

  it("should use toString method for custom objects but not JSON stringfy it", () => {
    const customObject = {
      a: 2,
      b: "text",
      c: { x: "test" },
    };
    const result = toString(customObject, false);
    expect(result).toBe("[object Object]");
  });
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - uint8ArrayFromString", () => {
  // ----------------------------------------------------------------------------------------------

  const uint8ArrayFromString = utils.uint8ArrayFromString;

  // ----------------------------------------------------------------------------------------------

  it("should return Uint8Array when no joinChar is specified", () => {
    const text = "Hello, world!";
    const result = uint8ArrayFromString(text);
    assert.ok(result instanceof Uint8Array);
    assert.strictEqual(result.length, text.length);
  });

  // ----------------------------------------------------------------------------------------------

  it("should return joined string when joinChar is specified", () => {
    const text = "Hello, world!";
    const joinChar = "-";
    const result = uint8ArrayFromString(text, joinChar);
    assert.strictEqual(typeof result, "string");
    assert.strictEqual(
      result,
      "72-101-108-108-111-44-32-119-111-114-108-100-33"
    );
  });

  // ----------------------------------------------------------------------------------------------

  it("should return empty Uint8Array when text is empty", () => {
    const result = uint8ArrayFromString("");
    assert.ok(result instanceof Uint8Array);
    assert.strictEqual(result.length, 0);
  });

  // ----------------------------------------------------------------------------------------------

  it("should return Uint8Array with correct values for non-ASCII characters", () => {
    const text = "😊🌟";
    const result = uint8ArrayFromString(text);
    const expected = new Uint8Array([240, 159, 152, 138, 240, 159, 140, 159]);
    assert.deepStrictEqual(result, expected);
  });

  // ----------------------------------------------------------------------------------------------

  it("should handle special characters correctly", () => {
    const text = "Special characters: \n\r\t";
    const result = uint8ArrayFromString(text);
    const expected = new Uint8Array([
      83, 112, 101, 99, 105, 97, 108, 32, 99, 104, 97, 114, 97, 99, 116, 101,
      114, 115, 58, 32, 10, 13, 9,
    ]);
    assert.deepStrictEqual(result, expected);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - uint8ArrayToString", () => {
  // ----------------------------------------------------------------------------------------------

  const uint8ArrayToString = utils.uint8ArrayToString;

  // ----------------------------------------------------------------------------------------------

  it("should return an empty string if uint8Array is null or undefined", () => {
    const result = uint8ArrayToString(null);
    assert.strictEqual(result, "");
  });

  // ----------------------------------------------------------------------------------------------

  it("should return the original string when no splitChar is specified", () => {
    const uint8Array = new Uint8Array([
      72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33,
    ]);
    const result = uint8ArrayToString(uint8Array);
    assert.strictEqual(result, "Hello, world!");
  });

  // ----------------------------------------------------------------------------------------------

  it("should return the original string when splitChar is not specified", () => {
    const uint8Array = new Uint8Array([
      72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33,
    ]);
    const result = uint8ArrayToString(uint8Array, "");
    assert.strictEqual(result, "Hello, world!");
  });

  // ----------------------------------------------------------------------------------------------

  it("should split the Uint8Array by the specified splitChar", () => {
    const uint8Array =
      "72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33";
    const result = uint8ArrayToString(uint8Array, ",");
    assert.strictEqual(result, "Hello, world!");
  });

  // ----------------------------------------------------------------------------------------------

  it("should correctly handle non-ASCII characters", () => {
    const uint8Array = new Uint8Array([240, 159, 152, 138, 240, 159, 140, 159]);
    const result = uint8ArrayToString(uint8Array);
    assert.strictEqual(result, "😊🌟");
  });

  // ----------------------------------------------------------------------------------------------

  it("should correctly handle empty Uint8Array", () => {
    const uint8Array = new Uint8Array([]);
    const result = uint8ArrayToString(uint8Array);
    assert.strictEqual(result, "");
  });
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - timestamp", () => {
  const timestamp = utils.timestamp;

  // Define uma data e hora fixas para garantir que os testes sejam consistentes.
  // Horário local de Curitiba (-03:00) para corresponder ao comportamento de new Date().
  const MOCK_DATE = new Date("2025-08-22T19:30:15.123-03:00");

  // Antes de cada teste, ativamos os timers falsos e fixamos o tempo.
  beforeEach(() => {
    // Estas são funções de bibliotecas como Vitest/Jest para simular o tempo
    // vi.useFakeTimers();
    // vi.setSystemTime(MOCK_DATE);
    // Para este exemplo, vamos simular o mock diretamente (não execute este código de mock em um projeto real, use o da sua lib de testes)
    global.Date = class extends Date {
      constructor() {
        super();
        return MOCK_DATE;
      }
    };
  });

  // Depois de cada teste, restauramos o comportamento normal do Date.
  afterEach(() => {
    // vi.useRealTimers();
    global.Date = Date;
  });

  // ----------------------------------------------------------------------------------------------

  it("should use the default format 'D-MT-Y_H:MN:S:MS' when no argument is provided", () => {
    const result = timestamp();
    assert.strictEqual(result, "22-08-2025_19:30:15:123");
  });

  // ----------------------------------------------------------------------------------------------

  it("should format a standard ISO 8601 date format", () => {
    const result = timestamp("Y-MT-D");
    assert.strictEqual(result, "2025-08-22");
  });

  // ----------------------------------------------------------------------------------------------

  it("should format a standard time format", () => {
    const result = timestamp("H:MN:S");
    assert.strictEqual(result, "19:30:15");
  });

  // ----------------------------------------------------------------------------------------------

  it("should format time including milliseconds", () => {
    const result = timestamp("H:MN:S:MS");
    assert.strictEqual(result, "19:30:15:123");
  });

  // ----------------------------------------------------------------------------------------------

  it("should handle custom separators like slashes, spaces, and pipes", () => {
    const result = timestamp("D/MT/Y | H_MN");
    assert.strictEqual(result, "22/08/2025 | 19_30");
  });

  // ----------------------------------------------------------------------------------------------

  it("should correctly format each token individually", () => {
    assert.strictEqual(timestamp("Y"), "2025", "Test for Y failed");
    assert.strictEqual(timestamp("MT"), "08", "Test for MT failed");
    assert.strictEqual(timestamp("D"), "22", "Test for D failed");
    assert.strictEqual(timestamp("H"), "19", "Test for H failed");
    assert.strictEqual(timestamp("MN"), "30", "Test for MN failed");
    assert.strictEqual(timestamp("S"), "15", "Test for S failed");
    assert.strictEqual(timestamp("MS"), "123", "Test for MS failed");
  });

  // ----------------------------------------------------------------------------------------------

  it("should return an empty string if the format string is empty", () => {
    const result = timestamp("");
    assert.strictEqual(result, "");
  });

  // ----------------------------------------------------------------------------------------------

  it("should treat non-token strings as literal characters and return them as is", () => {
    const result = timestamp("GO GO GO [LOG]");
    assert.strictEqual(result, "GO GO GO [LOG]");
  });

  // ----------------------------------------------------------------------------------------------

  it("should treat lowercase tokens as literal characters", () => {
    const result = timestamp("y-mt-d h:mn:s:ms");
    assert.strictEqual(result, "y-mt-d h:mn:s:ms");
  });

  // ----------------------------------------------------------------------------------------------

  it("should handle repeated tokens correctly", () => {
    const result = timestamp("Y/Y/Y H-H");
    assert.strictEqual(result, "2025/2025/2025 19-19");
  });

  // ----------------------------------------------------------------------------------------------

  it("should format a full timestamp in reverse order", () => {
    const result = timestamp("MS:S:MN H D-MT-Y");
    assert.strictEqual(result, "123:15:30 19 22-08-2025");
  });

  // ----------------------------------------------------------------------------------------------

  it("should handle a format with no separators", () => {
    const result = timestamp("YMTDHMN");
    assert.strictEqual(result, "202508221930");
  });
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - pickKeys", () => {
  const pickKeys = utils.pickKeys;

  // Objeto base usado na maioria dos testes para consistência.
  const sourceObject = {
    id: 123,
    name: "John Doe",
    email: "john.doe@example.com",
    status: "active",
  };

  // Adiciona uma propriedade herdada para testar a segurança contra o prototype chain.
  const sourceWithPrototype = Object.create({
    inherited: "should_not_be_picked",
  });
  Object.assign(sourceWithPrototype, sourceObject);

  // ----------------------------------------------------------------------------------------------
  // Casos de Uso Padrão
  // ----------------------------------------------------------------------------------------------

  it("should pick a subset of existing keys from an object", () => {
    const keys = ["id", "name"];
    const result = pickKeys(sourceObject, keys);
    const expected = { id: 123, name: "John Doe" };
    expect(result).toEqual(expected);
  });

  it("should return a new object instance, not a reference to the original", () => {
    const keys = ["id", "name"];
    const result = pickKeys(sourceObject, keys);
    expect(result).not.toBe(sourceObject);
  });

  it("should pick all keys if all are specified", () => {
    const keys = ["id", "name", "email", "status"];
    const result = pickKeys(sourceObject, keys);
    expect(result).toEqual(sourceObject);
  });

  // ----------------------------------------------------------------------------------------------
  // Casos de Borda (Edge Cases)
  // ----------------------------------------------------------------------------------------------

  it("should return an empty object if the array of keys is empty", () => {
    const result = pickKeys(sourceObject, []);
    expect(result).toEqual({});
  });

  it("should ignore keys that are in the array but not in the source object", () => {
    const keys = ["id", "nonExistentKey", "email"];
    const result = pickKeys(sourceObject, keys);
    const expected = { id: 123, email: "john.doe@example.com" };
    expect(result).toEqual(expected);
  });

  it("should return an empty object when picking from an empty source object", () => {
    const result = pickKeys({}, ["id", "name"]);
    expect(result).toEqual({});
  });

  it("should not pick inherited properties from the object's prototype", () => {
    const keys = ["id", "inherited"];
    const result = pickKeys(sourceWithPrototype, keys);
    const expected = { id: 123 };
    expect(result).toEqual(expected);
  });

  // ----------------------------------------------------------------------------------------------
  // Casos com Entradas Inválidas
  // ----------------------------------------------------------------------------------------------

  it.each([
    { value: null, description: "null" },
    { value: undefined, description: "undefined" },
    { value: "a string", description: "uma string" },
    { value: 123, description: "um número" },
    { value: [1, 2, 3], description: "um array" },
  ])(
    "should return an empty object if the source is not an object but $description",
    ({ value }) => {
      const result = pickKeys(value, ["id"]);
      expect(result).toEqual({});
    }
  );

  it.each([
    { value: null, description: "null" },
    { value: undefined, description: "undefined" },
    { value: "id", description: "uma string" },
    { value: 123, description: "um número" },
    { value: { key: "id" }, description: "um objeto" },
  ])(
    "should return an empty object if keysToPick is not an array but $description",
    ({ value }) => {
      const result = pickKeys(sourceObject, value);
      expect(result).toEqual({});
    }
  );
});
