const isDateString = require("../../lib/helpers/is-date-string");

describe("isDateString", () => {
  test("should check if a value from a querystring is a date", () => {
    // date string (correct format)
    expect(isDateString("2020-01-01")).toBe(true);

    // not a date string (or incorrect format)
    expect(isDateString("2020/01/01")).toBe(false);
    expect(isDateString("20200101")).toBe(false);
    expect(isDateString(20200101)).toBe(false);

    expect(isDateString()).toBe(false);
    expect(isDateString(null)).toBe(false);
    expect(isDateString("")).toBe(false);
    expect(isDateString(1)).toBe(false);
    expect(isDateString("1")).toBe(false);
  });
});
