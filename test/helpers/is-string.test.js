const isString = require("../../lib/helpers/is-string");

describe("isString", () => {
  test("should check if value is a string", () => {
    // strings
    expect(isString("")).toBe(true);
    expect(isString("-1")).toBe(true);
    expect(isString("0")).toBe(true);
    expect(isString("1")).toBe(true);
    expect(isString("null")).toBe(true);
    expect(isString("undefined")).toBe(true);
    expect(isString("NaN")).toBe(true);
    expect(isString("true")).toBe(true);
    expect(isString("false")).toBe(true);
    expect(isString("{}")).toBe(true);
    expect(isString("[]")).toBe(true);
    expect(isString(new String())).toBe(true);

    // not strings
    expect(isString()).toBe(false);
    expect(isString(null)).toBe(false);

    expect(isString(true)).toBe(false);
    expect(isString(false)).toBe(false);

    expect(isString(-1)).toBe(false);
    expect(isString(0)).toBe(false);
    expect(isString(1)).toBe(false);
    expect(isString(BigInt(-1))).toBe(false);
    expect(isString(BigInt(0))).toBe(false);
    expect(isString(BigInt(1))).toBe(false);
    expect(isString(NaN)).toBe(false);

    expect(isString(Symbol("1"))).toBe(false);
    expect(isString({})).toBe(false);
    expect(isString([])).toBe(false);
  });
});
