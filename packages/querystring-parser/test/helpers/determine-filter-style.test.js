/* eslint-disable jest/expect-expect */
const determineFilterStyle = require("../../lib/helpers/determine-filter-style");
const FilterStyle = require("../../lib/enums/filter-style");

describe("determineFilterStyle", () => {
  test("should return undefined when style can not be determined", () => {
    expect(determineFilterStyle()).toBe(undefined);
    expect(determineFilterStyle(null)).toBe(undefined);
    expect(determineFilterStyle("")).toBe(undefined);
    expect(determineFilterStyle("<querystring without filters>")).toBe(
      undefined,
    );
  });

  test("should return MONGO_DB", () => {
    expect(determineFilterStyle("filter[name][$eq]=michael")).toBe(
      FilterStyle.MONGO_DB,
    );
    expect(determineFilterStyle("filter[age]=25")).toBe(FilterStyle.MONGO_DB);
  });

  test("should return IBM", () => {
    expect(determineFilterStyle("filter=equals(name,'michael')")).toBe(
      FilterStyle.IBM,
    );
    expect(determineFilterStyle("filter=contains(name,'ch')")).toBe(
      FilterStyle.IBM,
    );
  });

  test("should not return IBM", () => {
    expect(determineFilterStyle("filter=abc")).toBe(undefined);
  });

  test("should handle still-encoded querystrings just fine", () => {
    const querystring =
      "filter%5Bproject_id%5D%5B%24eq%5D=b730e204-1218-4e9d-aa15-773c892baefb";
    expect(determineFilterStyle(querystring)).toBe(FilterStyle.MONGO_DB);
  });

  test("should throw error if multiple styles are detected", () => {
    expect(() => {
      determineFilterStyle(
        "filter[name][$eq]=michael&filter=equals(name,'michael')",
      );
    }).toThrow("querystring should not include multiple filter styles");
  });
});
