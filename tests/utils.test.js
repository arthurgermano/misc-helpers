import { describe, expect, it } from "vitest";
import { utils } from "../index";

// ------------------------------------------------------------------------------------------------

function deepEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

// ------------------------------------------------------------------------------------------------

function isString(variable) {
  return typeof variable === "string";
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

  it("base64To should return the correct string for object input", () => {
    const nonStringInput = {};
    const result = base64To(nonStringInput);
    expect(result).toBe("W29iamVjdCBPYmplY3Rd");
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

  it('dateToFormat should return "false" for an invalid date input', () => {
    const inputDate = "not a date";
    const result = dateToFormat(inputDate);

    expect(result).toBe("false");
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

describe("UTILS - generateHash", () => {
  // ----------------------------------------------------------------------------------------------

  const generateHash = utils.generateHash;

  // ----------------------------------------------------------------------------------------------

  it("generateHash should generate a hash with default parameters", () => {
    const inputText = "Hello, World!";
    const result = generateHash(inputText);
    expect(result).toBe("3/1gIbsr1bCvZ2KQgJ7DpTGR3YHH9wpLKGiKNiGCmG8=");
  });

  // ----------------------------------------------------------------------------------------------

  it("generateHash should generate a hash with custom encoding (hex)", () => {
    const inputText = "Hello, World!";
    const result = generateHash(inputText, "hex");
    expect(result).toBe(
      "dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f"
    );
  });

  // ----------------------------------------------------------------------------------------------

  it("generateHash should generate a hash with custom algorithm (sha512)", () => {
    const inputText = "Hello, World!";
    const result = generateHash(inputText, "base64", "sha512");
    expect(result).toBe(
      "N015SpXNz9izWZMYX++bo2jxYNja9DLQi6nx7R5avmzGkpHg+i/gAGpSVw7xjBne9OYXwzzlLvCm5fvjGMsDhw=="
    );
  });

  // ----------------------------------------------------------------------------------------------

  it("generateHash should return an empty string for empty text", () => {
    const result = generateHash("");
    expect(result).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("generateHash should return false when an invalid encode type is provided", () => {
    const inputText = "Hello, World!";
    const result = generateHash(inputText, "invalidEncode");
    expect(result).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("generateHash should return false when an invalid algorithm type is provided", () => {
    const inputText = "Hello, World!";
    const result = generateHash(inputText, "base64", "invalidAlgorithm");
    expect(result).toBe(false);
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

  it('JSONTo should return a JSON string for a valid object', () => {
    const inputObject = { key: 'value', number: 42 };
    const result = JSONTo(inputObject);
    expect(result).toBe('{"key":"value","number":42}');
  });
  
  // ----------------------------------------------------------------------------------------------
  
  it('JSONTo should return an empty object for an undefined object', () => {
    const result = JSONTo(undefined);
    expect(result).toBe("{}");
  });
  
  // ----------------------------------------------------------------------------------------------
  
  it('JSONTo should throw an error for a circular object when throwsError is true', () => {
    const circularObject = { key: 'value' };
    circularObject.circularReference = circularObject;
    expect(() => JSONTo(circularObject)).toThrow();
  });
  
  // ----------------------------------------------------------------------------------------------
  
  it('JSONTo should return null for a circular object when throwsError is false', () => {
    const circularObject = { key: 'value' };
    circularObject.circularReference = circularObject;
    const result = JSONTo(circularObject, false);
    expect(result).toBe(null);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------
