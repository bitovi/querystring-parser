const isNonEmptyString = require("../../lib/helpers/is-non-empty-string");

describe("isNonEmptyString", () => {
  test("should check if value is a non-empty string", () => {
    // non-empty strings
    expect(isNonEmptyString("-1")).toBe(true);
    expect(isNonEmptyString("0")).toBe(true);
    expect(isNonEmptyString("1")).toBe(true);
    expect(isNonEmptyString("null")).toBe(true);
    expect(isNonEmptyString("undefined")).toBe(true);
    expect(isNonEmptyString("NaN")).toBe(true);
    expect(isNonEmptyString("true")).toBe(true);
    expect(isNonEmptyString("false")).toBe(true);
    expect(isNonEmptyString("{}")).toBe(true);
    expect(isNonEmptyString("[]")).toBe(true);

    // not non-empty strings
    expect(isNonEmptyString("")).toBe(false);
    expect(isNonEmptyString(new String())).toBe(false);

    expect(isNonEmptyString()).toBe(false);
    expect(isNonEmptyString(null)).toBe(false);

    expect(isNonEmptyString(true)).toBe(false);
    expect(isNonEmptyString(false)).toBe(false);

    expect(isNonEmptyString(-1)).toBe(false);
    expect(isNonEmptyString(0)).toBe(false);
    expect(isNonEmptyString(1)).toBe(false);
    expect(isNonEmptyString(BigInt(-1))).toBe(false);
    expect(isNonEmptyString(BigInt(0))).toBe(false);
    expect(isNonEmptyString(BigInt(1))).toBe(false);
    expect(isNonEmptyString(NaN)).toBe(false);

    expect(isNonEmptyString(Symbol("1"))).toBe(false);
    expect(isNonEmptyString({})).toBe(false);
    expect(isNonEmptyString([])).toBe(false);
  });
});
