import { describe, it } from "vitest";
import { helpers } from "../index";

// ------------------------------------------------------------------------------------------------

describe("HELPERS - isObject", () => {
  // ----------------------------------------------------------------------------------------------

  it("isObject should return true for objects", () => {
    const obj = {};
    expect(helpers.isObject(obj)).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("isObject should return false for non-objects", () => {
    const nonObject = "Not an object";
    expect(helpers.isObject(nonObject)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("isObject should return true for arrays", () => {
    const arr = [];
    expect(helpers.isObject(arr)).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("isObject should return false for null", () => {
    const nullValue = null;
    expect(helpers.isObject(nullValue)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("HELPERS - isNumber", () => {
  // ----------------------------------------------------------------------------------------------
  it("isNumber should return true for valid numbers", () => {
    expect(helpers.isNumber(42)).toBe(true);
    expect(helpers.isNumber(3.14)).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("isNumber should return false for non-numbers", () => {
    expect(helpers.isNumber("not a number")).toBe(false);
    expect(helpers.isNumber(true)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("isNumber should return false for NaN", () => {
    expect(helpers.isNumber(NaN)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("isNumber should return false for Infinity", () => {
    expect(helpers.isNumber(Infinity)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("isNumber should return false for null", () => {
    expect(helpers.isNumber(null)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("isNumber should return false for undefined", () => {
    expect(helpers.isNumber(undefined)).toBe(false);
  });

  it("isNumber should return false for Array", () => {
    expect(helpers.isNumber([])).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("isNumber should return false for Array with values", () => {
    expect(helpers.isNumber([1])).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("isNumber should return false for Object", () => {
    expect(helpers.isNumber({})).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("isNumber should return false for Object with values", () => {
    expect(helpers.isNumber({ 2: 2 })).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("HELPERS - isInstanceOf", () => {
  // ----------------------------------------------------------------------------------------------
  class ExampleClass {}
  it("isInstanceOf should return true for instances of the specified class", () => {
    const instance = new ExampleClass();
    expect(helpers.isInstanceOf(instance, ExampleClass)).toBe(true);
  });

  it("isInstanceOf should return false for non-instances of the specified class", () => {
    const notAnInstance = {};
    expect(helpers.isInstanceOf(notAnInstance, ExampleClass)).toBe(false);
  });

  it("isInstanceOf should return false for null", () => {
    const nullValue = null;
    expect(helpers.isInstanceOf(nullValue, ExampleClass)).toBe(false);
  });

  it("isInstanceOf should return false for undefined", () => {
    const undefinedValue = undefined;
    expect(helpers.isInstanceOf(undefinedValue, ExampleClass)).toBe(false);
  });

  it("isInstanceOf should return false for primitive values", () => {
    const numberValue = 42;
    const stringValue = "hello";
    const booleanValue = true;

    expect(helpers.isInstanceOf(numberValue, Number)).toBe(false);
    expect(helpers.isInstanceOf(stringValue, String)).toBe(false);
    expect(helpers.isInstanceOf(booleanValue, Boolean)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("isInstanceOf should return true for instances of EventEmitter class", () => {
    const EventEmitter = require("events");
    const emitter = new EventEmitter();
    expect(helpers.isInstanceOf(emitter, EventEmitter)).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("HELPERS - defaultValue", () => {
  // ----------------------------------------------------------------------------------------------

  it("defaultValue should return the checkValue if it is truthy", () => {
    const checkValue = "truthyValue";
    const fallbackValue = "fallbackValue";
    expect(helpers.defaultValue(checkValue, fallbackValue)).toBe(checkValue);
  });

  // ----------------------------------------------------------------------------------------------

  it("defaultValue should return the defaultValue if checkValue is falsy", () => {
    const checkValue = null;
    const fallbackValue = "fallbackValue";
    expect(helpers.defaultValue(checkValue, fallbackValue)).toBe(fallbackValue);
  });

  // ----------------------------------------------------------------------------------------------

  it("defaultValue should handle 0 as a truthy value", () => {
    const checkValue = 0;
    const fallbackValue = "fallbackValue";
    expect(helpers.defaultValue(checkValue, fallbackValue)).toBe(checkValue);
  });

  // ----------------------------------------------------------------------------------------------

  it("defaultValue should handle an empty string as a truthy value", () => {
    const checkValue = "";
    const fallbackValue = "fallbackValue";
    expect(helpers.defaultValue(checkValue, fallbackValue)).toBe(checkValue);
  });

  // ----------------------------------------------------------------------------------------------

  it("defaultValue should handle undefined as a falsy value", () => {
    const checkValue = undefined;
    const fallbackValue = "fallbackValue";
    expect(helpers.defaultValue(checkValue, fallbackValue)).toBe(fallbackValue);
  });

  // ----------------------------------------------------------------------------------------------

  it("defaultValue should handle false as a truthy value", () => {
    const checkValue = false;
    const fallbackValue = "fallbackValue";
    expect(helpers.defaultValue(checkValue, fallbackValue)).toBe(checkValue);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("HELPERS - dateCompareAsc", () => {
  // ----------------------------------------------------------------------------------------------

  it("dateCompareAsc should return true when dateA is earlier than dateB", () => {
    const dateA = new Date(2022, 0, 1); // January 1, 2022
    const dateB = new Date(2022, 0, 2); // January 2, 2022

    const result = helpers.dateCompareAsc(dateA, dateB);

    expect(result).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("dateCompareAsc should return false when dateA is later than dateB", () => {
    const dateA = new Date(2022, 0, 2); // January 2, 2022
    const dateB = new Date(2022, 0, 1); // January 1, 2022

    const result = helpers.dateCompareAsc(dateA, dateB);

    expect(result).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("dateCompareAsc should handle options.considerHMS correctly", () => {
    const dateA = new Date(2022, 0, 1, 0, 0, 0); // January 1, 2022, 00:00:00
    const dateB = new Date(2022, 0, 1, 12, 30, 0); // January 2, 2022, 12:30:00

    const resultWithoutOriginalTime = helpers.dateCompareAsc(dateA, dateB, {
      considerHMS: false,
    });
    const resultWithOriginalTime = helpers.dateCompareAsc(dateA, dateB, {
      considerHMS: true,
    });

    expect(resultWithoutOriginalTime).toBe(false);
    expect(resultWithOriginalTime).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("dateCompareAsc should handle options.considerEquals correctly", () => {
    const dateA = new Date(2022, 0, 1); // January 1, 2022
    const dateB = new Date(2022, 0, 1); // January 1, 2022

    const resultWithoutConsiderEquals = helpers.dateCompareAsc(dateA, dateB, {
      considerEquals: false,
    });
    const resultWithConsiderEquals = helpers.dateCompareAsc(dateA, dateB, {
      considerEquals: true,
    });

    expect(resultWithoutConsiderEquals).toBe(false);
    expect(resultWithConsiderEquals).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("dateCompareAsc should handle options.ignoreErrors correctly", () => {
    const invalidDate = "invalid date";

    const resultWithIgnoreErrors = helpers.dateCompareAsc(
      invalidDate,
      new Date(),
      { ignoreErrors: true }
    );
    const resultWithoutIgnoreErrors = () =>
      helpers.dateCompareAsc(invalidDate, new Date());

    expect(resultWithIgnoreErrors).toBeNull();
    expect(resultWithoutIgnoreErrors).toThrowError(
      "dateCompareAsc Function: dateA provided is not a Date Object"
    );
  });

  // ----------------------------------------------------------------------------------------------

  it("dateCompareAsc with multiple options set at the same time", () => {
    const dateA = new Date(2022, 0, 1, 12, 30, 0); // January 1, 2022, 12:30:00
    const dateB = new Date(2022, 0, 1, 0, 0, 0); // January 1, 2022, 00:00:00

    // Test with considerHMS: true, considerEquals: false, ignoreErrors: false
    const result1 = helpers.dateCompareAsc(dateA, dateB, {
      considerHMS: true,
      considerEquals: false,
      ignoreErrors: false,
    });
    expect(result1).toBe(false);

    // Test with considerHMS: false, considerEquals: true, ignoreErrors: false
    const result2 = helpers.dateCompareAsc(dateA, dateB, {
      considerHMS: false,
      considerEquals: true,
      ignoreErrors: false,
    });
    expect(result2).toBe(true);

    // Test with considerHMS: true, considerEquals: true, ignoreErrors: true
    const result3 = helpers.dateCompareAsc(dateA, dateB, {
      considerHMS: true,
      considerEquals: true,
      ignoreErrors: true,
    });
    expect(result3).toBe(false);

    // Test with considerHMS: false, considerEquals: false, ignoreErrors: true
    const result4 = helpers.dateCompareAsc(dateA, dateB, {
      considerHMS: false,
      considerEquals: false,
      ignoreErrors: true,
    });
    expect(result4).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("HELPERS - dateCompareDesc", () => {
  // ----------------------------------------------------------------------------------------------

  it("dateCompareDesc should return true when dateA is earlier than dateB", () => {
    const dateA = new Date(2022, 0, 2); // January 1, 2022
    const dateB = new Date(2022, 0, 1); // January 2, 2022

    const result = helpers.dateCompareDesc(dateA, dateB);

    expect(result).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("dateCompareDesc should return false when dateA is later than dateB", () => {
    const dateA = new Date(2022, 0, 1); // January 2, 2022
    const dateB = new Date(2022, 0, 2); // January 1, 2022

    const result = helpers.dateCompareDesc(dateA, dateB);

    expect(result).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("dateCompareDesc should handle options.considerHMS correctly", () => {
    const dateA = new Date(2022, 0, 1, 12, 30, 0); // January 1, 2022, 00:00:00
    const dateB = new Date(2022, 0, 1, 0, 0, 0); // January 2, 2022, 12:30:00

    const resultWithoutOriginalTime = helpers.dateCompareDesc(dateA, dateB, {
      considerHMS: false,
    });
    const resultWithOriginalTime = helpers.dateCompareDesc(dateA, dateB, {
      considerHMS: true,
    });

    expect(resultWithoutOriginalTime).toBe(false);
    expect(resultWithOriginalTime).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("dateCompareDesc should handle options.considerEquals correctly", () => {
    const dateA = new Date(2022, 0, 1); // January 1, 2022
    const dateB = new Date(2022, 0, 1); // January 1, 2022

    const resultWithoutConsiderEquals = helpers.dateCompareDesc(dateA, dateB, {
      considerEquals: false,
    });
    const resultWithConsiderEquals = helpers.dateCompareDesc(dateA, dateB, {
      considerEquals: true,
    });

    expect(resultWithoutConsiderEquals).toBe(false);
    expect(resultWithConsiderEquals).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("dateCompareDesc should handle options.ignoreErrors correctly", () => {
    const invalidDate = "invalid date";

    const resultWithIgnoreErrors = helpers.dateCompareDesc(
      invalidDate,
      new Date(),
      { ignoreErrors: true }
    );
    const resultWithoutIgnoreErrors = () =>
      helpers.dateCompareDesc(invalidDate, new Date());

    expect(resultWithIgnoreErrors).toBeNull();
    expect(resultWithoutIgnoreErrors).toThrowError(
      "dateCompareDesc Function: dateA provided is not a Date Object"
    );
  });

  // ----------------------------------------------------------------------------------------------

  it("dateCompareDesc with multiple options set at the same time", () => {
    const dateA = new Date(2022, 0, 1, 0, 0, 0); // January 1, 2022, 12:30:00
    const dateB = new Date(2022, 0, 1, 12, 30, 0); // January 1, 2022, 00:00:00

    // Test with considerHMS: true, considerEquals: false, ignoreErrors: false
    const result1 = helpers.dateCompareDesc(dateA, dateB, {
      considerHMS: true,
      considerEquals: false,
      ignoreErrors: false,
    });
    expect(result1).toBe(false);

    // Test with considerHMS: false, considerEquals: true, ignoreErrors: false
    const result2 = helpers.dateCompareDesc(dateA, dateB, {
      considerHMS: false,
      considerEquals: true,
      ignoreErrors: false,
    });
    expect(result2).toBe(true);

    // Test with considerHMS: true, considerEquals: true, ignoreErrors: true
    const result3 = helpers.dateCompareDesc(dateA, dateB, {
      considerHMS: true,
      considerEquals: true,
      ignoreErrors: true,
    });
    expect(result3).toBe(false);

    // Test with considerHMS: false, considerEquals: false, ignoreErrors: true
    const result4 = helpers.dateCompareDesc(dateA, dateB, {
      considerHMS: false,
      considerEquals: false,
      ignoreErrors: true,
    });
    expect(result4).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------
