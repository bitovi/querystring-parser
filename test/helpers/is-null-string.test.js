const isNullString = require("../../lib/helpers/is-null-string");

describe("isNullString", () => {
  test('should check if a value from a querystring represents "null"', () => {
    // null string
    expect(isNullString("null")).toBe(true);

    // not null string
    expect(isNullString()).toBe(false);
    expect(isNullString(null)).toBe(false);
    expect(isNullString("")).toBe(false);
    expect(isNullString(true)).toBe(false);
    expect(isNullString(false)).toBe(false);
    expect(isNullString(1)).toBe(false);
    expect(isNullString(0)).toBe(false);
    expect(isNullString(NaN)).toBe(false);
  });
});
