import { describe, expect, it, vi } from "vitest";
import { custom, constants, utils } from "../index.js";

// ------------------------------------------------------------------------------------------------

describe("CUSTOM - setConditionBetweenDates", () => {
  // ----------------------------------------------------------------------------------------------

  const setConditionBetweenDates = custom.db.sequelize.setConditionBetweenDates;

  // ----------------------------------------------------------------------------------------------

  it("setConditionBetweenDates should return null when no date keys are provided", () => {
    const result = setConditionBetweenDates({});
    expect(result).toBeNull();
  });

  // ----------------------------------------------------------------------------------------------

  it('setConditionBetweenDates should set the $gte condition when only "created_at_from" is provided', () => {
    const inputObject = {
      created_at_from: "01-01-2022",
    };
    const expectedTime = utils.dateFirstHourOfDay(
      utils.stringToDate(
        inputObject.created_at_from,
        constants.DATE_BR_FORMAT_D
      )
    );
    const result = setConditionBetweenDates(
      inputObject,
      constants.DATE_BR_FORMAT_D
    );

    expect(result).toHaveProperty("created_at");
    expect(result.created_at).toHaveProperty("$and");
    expect(Array.isArray(result.created_at.$and)).toBe(true);
    expect(result.created_at.$and[0]).toHaveProperty("$gte");
    expect(result.created_at.$and[0].$gte.getTime()).toBe(
      expectedTime.getTime()
    );
  });

  // ----------------------------------------------------------------------------------------------

  it('setConditionBetweenDates should set the $lte condition when only "created_at_until" is provided', () => {
    const inputObject = {
      created_at_until: "31-01-2022",
    };

    const expectedTime = utils.dateLastHourOfDay(
      utils.stringToDate(
        inputObject.created_at_until,
        constants.DATE_BR_FORMAT_D
      )
    );

    const result = setConditionBetweenDates(
      inputObject,
      constants.DATE_BR_FORMAT_D
    );

    expect(result).toHaveProperty("created_at");
    expect(result.created_at).toHaveProperty("$and");
    expect(Array.isArray(result.created_at.$and)).toBe(true);
    expect(result.created_at.$and[0]).toHaveProperty("$lte");
    expect(result.created_at.$and[0].$lte.getTime()).toBe(
      expectedTime.getTime()
    );
  });

  // ----------------------------------------------------------------------------------------------

  it('setConditionBetweenDates should set both $gte and $lte conditions when both "created_at_from" and "created_at_until" are provided', () => {
    const inputObject = {
      created_at_from: "01-01-2022",
      created_at_until: "31-01-2022",
    };

    const expectedTimeFrom = utils.dateFirstHourOfDay(
      utils.stringToDate(
        inputObject.created_at_from,
        constants.DATE_BR_FORMAT_D
      )
    );

    const expectedTimeUntil = utils.dateLastHourOfDay(
      utils.stringToDate(
        inputObject.created_at_until,
        constants.DATE_BR_FORMAT_D
      )
    );

    const result = setConditionBetweenDates(
      inputObject,
      constants.DATE_BR_FORMAT_D
    );

    expect(result).toHaveProperty("created_at");
    expect(result.created_at).toHaveProperty("$and");
    expect(Array.isArray(result.created_at.$and)).toBe(true);
    expect(result.created_at.$and[0]).toHaveProperty("$gte");
    expect(result.created_at.$and[0].$gte.getTime()).toBe(
      expectedTimeFrom.getTime()
    );
    expect(result.created_at.$and[1]).toHaveProperty("$lte");
    expect(result.created_at.$and[1].$lte.getTime()).toBe(
      expectedTimeUntil.getTime()
    );
  });

  // ----------------------------------------------------------------------------------------------

  it("setConditionBetweenDates should return null when no date keys are provided", () => {
    const inputObject = {};

    const result = setConditionBetweenDates(
      inputObject,
      constants.DATE_BR_FORMAT_D
    );

    expect(result).toBeNull();
  });

  // ----------------------------------------------------------------------------------------------

  it('setConditionBetweenDates should set the $gte condition when only "updated_after" is provided', () => {
    const inputObject = {
      updated_after: "10-01-2022",
    };

    const expectedTime = utils.dateFirstHourOfDay(
      utils.stringToDate(inputObject.updated_after, constants.DATE_BR_FORMAT_D)
    );

    const result = setConditionBetweenDates(
      inputObject,
      constants.DATE_BR_FORMAT_D,
      "updated_at",
      "updated_until",
      "updated_after"
    );

    expect(result).toHaveProperty("updated_at");
    expect(result.updated_at).toHaveProperty("$and");
    expect(Array.isArray(result.updated_at.$and)).toBe(true);
    expect(result.updated_at.$and[0]).toHaveProperty("$gte");
    expect(result.updated_at.$and[0].$gte.getTime()).toBe(
      expectedTime.getTime()
    );
  });

  // ----------------------------------------------------------------------------------------------

  it('setConditionBetweenDates should set the $lte condition when only "updated_until" is provided', () => {
    const inputObject = {
      updated_until: "31-01-2022",
    };

    const expectedTime = utils.dateLastHourOfDay(
      utils.stringToDate(inputObject.updated_until, constants.DATE_BR_FORMAT_D)
    );

    const result = setConditionBetweenDates(
      inputObject,
      constants.DATE_BR_FORMAT_D,
      "updated_at",
      "updated_until",
      "updated_after"
    );

    expect(result).toHaveProperty("updated_at");
    expect(result.updated_at).toHaveProperty("$and");
    expect(Array.isArray(result.updated_at.$and)).toBe(true);
    expect(result.updated_at.$and[0]).toHaveProperty("$lte");
    expect(result.updated_at.$and[0].$lte.getTime()).toBe(
      expectedTime.getTime()
    );
  });

  // ----------------------------------------------------------------------------------------------

  it('setConditionBetweenDates should set both $gte and $lte conditions when both "updated_after" and "updated_until" are provided', () => {
    const inputObject = {
      updated_after: "01-01-2022",
      updated_until: "31-01-2022",
    };

    const expectedTimeFrom = utils.dateFirstHourOfDay(
      utils.stringToDate(inputObject.updated_after, constants.DATE_BR_FORMAT_D)
    );

    const expectedTimeUntil = utils.dateLastHourOfDay(
      utils.stringToDate(inputObject.updated_until, constants.DATE_BR_FORMAT_D)
    );

    const result = setConditionBetweenDates(
      inputObject,
      constants.DATE_BR_FORMAT_D,
      "updated_at",
      "updated_until",
      "updated_after"
    );

    expect(result).toHaveProperty("updated_at");
    expect(result.updated_at).toHaveProperty("$and");
    expect(Array.isArray(result.updated_at.$and)).toBe(true);
    expect(result.updated_at.$and[0]).toHaveProperty("$gte");
    expect(result.updated_at.$and[0].$gte.getTime()).toBe(
      expectedTimeFrom.getTime()
    );
    expect(result.updated_at.$and[1]).toHaveProperty("$lte");
    expect(result.updated_at.$and[1].$lte.getTime()).toBe(
      expectedTimeUntil.getTime()
    );
  });

  // ----------------------------------------------------------------------------------------------

  it("setConditionBetweenDates should reset hours, minutes, and seconds when resetHMS=true", () => {
    const inputObject = {
      created_at_from: "01-01-2022 15:30:45",
    };

    const expectedTime = utils.dateFirstHourOfDay(
      utils.stringToDate(
        inputObject.created_at_from,
        constants.DATE_BR_FORMAT_D
      )
    );

    const result = setConditionBetweenDates(
      inputObject,
      constants.DATE_BR_FORMAT_D,
      "created_at",
      "created_at_until",
      "created_at_from",
      true
    );

    expect(result).toHaveProperty("created_at");
    expect(result.created_at).toHaveProperty("$and");
    expect(Array.isArray(result.created_at.$and)).toBe(true);
    expect(result.created_at.$and[0]).toHaveProperty("$gte");
    expect(result.created_at.$and[0].$gte.getTime()).toBe(
      expectedTime.getTime()
    );
  });

  // ----------------------------------------------------------------------------------------------

  it("setConditionBetweenDates should not reset hours, minutes, and seconds when resetHMS=false", () => {
    const inputObject = {
      created_at_from: "01-01-2022 15:30:45",
    };

    const expectedTime = utils.stringToDate(
      inputObject.created_at_from,
      constants.DATE_BR_FORMAT_D
    );

    const result = setConditionBetweenDates(
      inputObject,
      constants.DATE_BR_FORMAT_D,
      "created_at",
      "created_at_until",
      "created_at_from",
      false
    );

    expect(result).toHaveProperty("created_at");
    expect(result.created_at).toHaveProperty("$and");
    expect(Array.isArray(result.created_at.$and)).toBe(true);
    expect(result.created_at.$and[0]).toHaveProperty("$gte");
    expect(result.created_at.$and[0].$gte.getTime()).toBeGreaterThan(
      expectedTime.getTime() - 10
    );
    expect(result.created_at.$and[0].$gte.getTime()).toBeLessThan(
      expectedTime.getTime() + 10
    );
  });

  // ----------------------------------------------------------------------------------------------

  it("setConditionBetweenDates should reset hours, minutes, and seconds for $lte condition when resetHMS=true", () => {
    const inputObject = {
      created_at_until: "31-01-2022 18:45:30",
    };

    const expectedTime = utils.dateLastHourOfDay(
      utils.stringToDate(
        inputObject.created_at_until,
        constants.DATE_BR_FORMAT_D
      )
    );

    const result = setConditionBetweenDates(
      inputObject,
      constants.DATE_BR_FORMAT_D,
      "created_at",
      "created_at_until",
      "created_at_from",
      true
    );

    expect(result).toHaveProperty("created_at");
    expect(result.created_at).toHaveProperty("$and");
    expect(Array.isArray(result.created_at.$and)).toBe(true);
    expect(result.created_at.$and[0]).toHaveProperty("$lte");
    expect(result.created_at.$and[0].$lte.getTime()).toBe(
      expectedTime.getTime()
    );
  });

  // ----------------------------------------------------------------------------------------------

  it("setConditionBetweenDates should not reset hours, minutes, and seconds for $lte condition when resetHMS=false", () => {
    const inputObject = {
      created_at_until: "31-01-2022 18:45:30",
    };

    const expectedTime = utils.stringToDate(
      inputObject.created_at_until,
      constants.DATE_BR_FORMAT_D
    );

    const result = setConditionBetweenDates(
      inputObject,
      constants.DATE_BR_FORMAT_D,
      "created_at",
      "created_at_until",
      "created_at_from",
      false
    );

    expect(result).toHaveProperty("created_at");
    expect(result.created_at).toHaveProperty("$and");
    expect(Array.isArray(result.created_at.$and)).toBe(true);
    expect(result.created_at.$and[0]).toHaveProperty("$lte");
    expect(result.created_at.$and[0].$lte.getTime()).toBeGreaterThan(
      expectedTime.getTime() - 10
    );
    expect(result.created_at.$and[0].$lte.getTime()).toBeLessThan(
      expectedTime.getTime() + 10
    );
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("CUSTOM - setConditionBetweenDates", () => {
  // ----------------------------------------------------------------------------------------------

  const setConditionBetweenValues =
    custom.db.sequelize.setConditionBetweenValues;

  // ----------------------------------------------------------------------------------------------

  it('setConditionBetweenValues should set the $gte condition when only "value_from" is provided', () => {
    const inputObject = {
      value_from: 10,
    };

    const result = setConditionBetweenValues(inputObject);

    expect(result).toHaveProperty("value");
    expect(result.value).toHaveProperty("$and");
    expect(Array.isArray(result.value.$and)).toBe(true);
    expect(result.value.$and[0]).toHaveProperty("$gte");
    expect(result.value.$and[0].$gte).toBe(inputObject.value_from);
  });

  // ----------------------------------------------------------------------------------------------

  it('setConditionBetweenValues should set the $lte condition when only "value_until" is provided', () => {
    const inputObject = {
      value_until: 20,
    };

    const result = setConditionBetweenValues(inputObject);

    expect(result).toHaveProperty("value");
    expect(result.value).toHaveProperty("$and");
    expect(Array.isArray(result.value.$and)).toBe(true);
    expect(result.value.$and[0]).toHaveProperty("$lte");
    expect(result.value.$and[0].$lte).toBe(inputObject.value_until);
  });

  // ----------------------------------------------------------------------------------------------

  it('setConditionBetweenValues should set both $gte and $lte conditions when both "value_from" and "value_until" are provided', () => {
    const inputObject = {
      value_from: 10,
      value_until: 20,
    };

    const result = setConditionBetweenValues(inputObject);

    expect(result).toHaveProperty("value");
    expect(result.value).toHaveProperty("$and");
    expect(Array.isArray(result.value.$and)).toBe(true);
    expect(result.value.$and[0]).toHaveProperty("$gte");
    expect(result.value.$and[0].$gte).toBe(inputObject.value_from);
    expect(result.value.$and[1]).toHaveProperty("$lte");
    expect(result.value.$and[1].$lte).toBe(inputObject.value_until);
  });

  // ----------------------------------------------------------------------------------------------

  it('setConditionBetweenValues should not set any conditions when neither "value_from" nor "value_until" are provided', () => {
    const inputObject = {};

    const result = setConditionBetweenValues(inputObject);

    expect(result).toBeUndefined();
  });

  // ----------------------------------------------------------------------------------------------

  it('setConditionBetweenValues should set the $gte condition when only "size_after" is provided', () => {
    const inputObject = {
      size_after: 30,
    };

    const result = setConditionBetweenValues(
      inputObject,
      "size",
      "size_until",
      "size_after"
    );

    expect(result).toHaveProperty("size");
    expect(result.size).toHaveProperty("$and");
    expect(Array.isArray(result.size.$and)).toBe(true);
    expect(result.size.$and[0]).toHaveProperty("$gte");
    expect(result.size.$and[0].$gte).toBe(inputObject.size_after);
  });

  // ----------------------------------------------------------------------------------------------

  it('setConditionBetweenValues should set the $lte condition when only "size_until" is provided', () => {
    const inputObject = {
      size_until: 50,
    };

    const result = setConditionBetweenValues(
      inputObject,
      "size",
      "size_until",
      "size_after"
    );

    expect(result).toHaveProperty("size");
    expect(result.size).toHaveProperty("$and");
    expect(Array.isArray(result.size.$and)).toBe(true);
    expect(result.size.$and[0]).toHaveProperty("$lte");
    expect(result.size.$and[0].$lte).toBe(inputObject.size_until);
  });

  // ----------------------------------------------------------------------------------------------

  it('setConditionBetweenValues should set both $gte and $lte conditions when both "size_after" and "size_until" are provided', () => {
    const inputObject = {
      size_after: 30,
      size_until: 50,
    };

    const result = setConditionBetweenValues(
      inputObject,
      "size",
      "size_until",
      "size_after"
    );

    expect(result).toHaveProperty("size");
    expect(result.size).toHaveProperty("$and");
    expect(Array.isArray(result.size.$and)).toBe(true);
    expect(result.size.$and[0]).toHaveProperty("$gte");
    expect(result.size.$and[0].$gte).toBe(inputObject.size_after);
    expect(result.size.$and[1]).toHaveProperty("$lte");
    expect(result.size.$and[1].$lte).toBe(inputObject.size_until);
  });

  // ----------------------------------------------------------------------------------------------

  it('setConditionBetweenValues should not set any conditions when neither "size_after" nor "size_until" are provided', () => {
    const inputObject = {};

    const result = setConditionBetweenValues(
      inputObject,
      "size",
      "size_until",
      "size_after"
    );

    expect(result).toBeUndefined();
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("CUSTOM - setConditionStringLike", () => {
  // ----------------------------------------------------------------------------------------------

  const setConditionStringLike = custom.db.sequelize.setConditionStringLike;

  // ----------------------------------------------------------------------------------------------

  it("setConditionStringLike should set the %% when all values are passed correctly", () => {
    const inputObject = {
      some_text: "test",
    };

    setConditionStringLike(inputObject, "some_text");

    expect(inputObject).toHaveProperty("some_text");
    expect(inputObject.some_text).toHaveProperty("$iLike");
    expect(inputObject.some_text.$iLike).toBe("%test%");
  });

  // ----------------------------------------------------------------------------------------------

  it("setConditionStringLike should set the %% when all values are passed correctly with numbers", () => {
    const inputObject = {
      some_text: 1,
    };

    setConditionStringLike(inputObject, "some_text");

    expect(inputObject).toHaveProperty("some_text");
    expect(inputObject.some_text).toHaveProperty("$iLike");
    expect(inputObject.some_text.$iLike).toBe("%1%");
  });

  // ----------------------------------------------------------------------------------------------

  it("setConditionStringLike should't change the object when the properties are not passed correctly", () => {
    const inputObject = {
      some_text: 1,
    };

    setConditionStringLike(inputObject, "xxx");

    expect(inputObject.some_text).toBe(1);
  });

  // ----------------------------------------------------------------------------------------------

  it("setConditionStringLike should set the %% when all values are passed correctly and sensitive case", () => {
    const inputObject = {
      some_text: "test",
    };

    setConditionStringLike(inputObject, "some_text", false);

    expect(inputObject).toHaveProperty("some_text");
    expect(inputObject.some_text).toHaveProperty("$like");
    expect(inputObject.some_text.$like).toBe("%test%");
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("WaitPlugin", () => {
  const waitPlugin = custom.waitPlugin;

  // ----------------------------------------------------------------------------------------------

  it("WaitPlugin - should add a promise to waitList", () => {
    waitPlugin.startWait("testA");
    expect(waitPlugin.waitList["testA"]).toBeDefined();
    expect(waitPlugin.waitList["testA"].promise).toBeInstanceOf(Promise);
    waitPlugin.finishWait("testA", true)
  });

  // ----------------------------------------------------------------------------------------------

  it("WaitPlugin - should not add a promise if one with the same name already exists", () => {
    waitPlugin.startWait("testB");
    const initialPromise = waitPlugin.waitList["testB"].promise;
    waitPlugin.startWait("testB");
    expect(waitPlugin.waitList["testB"].promise).toBe(initialPromise);
    waitPlugin.finishWait("testB", true)
  });

  // ----------------------------------------------------------------------------------------------

  it("WaitPlugin - should resolve the promise if successful", async () => {
    const promise = waitPlugin.startWait("testC");
    setTimeout(() => waitPlugin.finishWait("testC", true), 25);
    await expect(promise).resolves.toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("WaitPlugin - should reject the promise if not successful", async () => {
    const promise = waitPlugin.startWait("testD");
    setTimeout(() => waitPlugin.finishWait("testD", false), 25);
    await expect(promise).rejects.toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("WaitPlugin - should return false if the waitList item does not exist", () => {
    expect(waitPlugin.finishWait("nonExistent")).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("WaitPlugin - should call finishWait for each item in waitList", () => {
    waitPlugin.startWait("test1");
    waitPlugin.startWait("test2");
    waitPlugin.startWait("test3");
    const finishWaitMock = vi.spyOn(waitPlugin, "finishWait");
    waitPlugin.finishAll(true);
    expect(finishWaitMock).toHaveBeenCalledTimes(3);
    expect(finishWaitMock).toHaveBeenCalledWith("test1", true, undefined);
    expect(finishWaitMock).toHaveBeenCalledWith("test2", true, undefined);
    expect(finishWaitMock).toHaveBeenCalledWith("test3", true, undefined);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------
