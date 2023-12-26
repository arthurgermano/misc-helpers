import { describe, expect, it } from "vitest";
import { constants, utils } from "../index";

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

  it("base64To should return the correct JSON stringfied for object input", () => {
    const nonStringInput = {};
    const result = base64To(nonStringInput);
    expect(result).toBe("e30");
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
    expect(result).toBe("");
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
    expect(result).toEqual("2021/05");
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
    const result = stringToFormat(undefined, 'XXX.XXX.XXX-XX', options);
    expect(result).toBe("XXX.XXX.XXX-XX");
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - toString", () => {
  // ----------------------------------------------------------------------------------------------

  const toString = utils.toString;

  // ----------------------------------------------------------------------------------------------

  it('should return an empty string for undefined input', () => {
    const result = toString();
    expect(result).toBe('');
  });

  // ----------------------------------------------------------------------------------------------

  it('should return the same string for a string input', () => {
    const inputText = 'Hello, World!';
    const result = toString(inputText);
    expect(result).toBe(inputText);
  });

  // ----------------------------------------------------------------------------------------------

  it('should convert a number to a string', () => {
    const inputNumber = 42;
    const result = toString(inputNumber);
    expect(result).toBe('42');
  });

  // ----------------------------------------------------------------------------------------------

  it('should convert a boolean to a string', () => {
    const inputBoolean = true;
    const result = toString(inputBoolean);
    expect(result).toBe('true');
  });

  // ----------------------------------------------------------------------------------------------

  it('should use toString method for custom objects', () => {
    const customObject = {
      toString: () => 'Custom Object',
    };
    const result = toString(customObject);
    expect(result).toBe('Custom Object');
  });

  // ----------------------------------------------------------------------------------------------

  it('should convert null to an empty string', () => {
    const inputNull = null;
    const result = toString(inputNull);
    expect(result).toBe('');
  });

  // ----------------------------------------------------------------------------------------------

  it('should convert undefined to an empty string', () => {
    const inputUndefined = undefined;
    const result = toString(inputUndefined);
    expect(result).toBe('');
  });

  // ----------------------------------------------------------------------------------------------

  it('should convert symbols to a string', () => {
    const inputSymbol = Symbol('test');
    const result = toString(inputSymbol);
    expect(result).toBe('Symbol(test)');
  });

  // ----------------------------------------------------------------------------------------------

  it('should use toString method for custom objects', () => {
    const customObject = {
      a: 2,
      b: "text",
      c: { x: "test"}
    };
    const result = toString(customObject);
    expect(result).toBe('{"a":2,"b":"text","c":{"x":"test"}}');
  });

  // ----------------------------------------------------------------------------------------------

  it('should use toString method for custom objects but not JSON stringfy it', () => {
    const customObject = {
      a: 2,
      b: "text",
      c: { x: "test"}
    };
    const result = toString(customObject, false);
    expect(result).toBe('[object Object]');
  });
});

// ------------------------------------------------------------------------------------------------

