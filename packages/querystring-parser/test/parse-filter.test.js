const parseFilter = require("../lib/parse-filter");
const QuerystringParsingError = require("../lib/errors/querystring-parsing-error");
const expectErrorsToMatch = require("./test-utils/expect-errors-to-match");

function testEachCase(testCases) {
  test.concurrent.each(testCases)(
    "$title",
    ({ querystring, expectedResults, expectedErrors }) => {
      const { results, errors } = parseFilter(querystring);
      expect(results).toEqual(expectedResults);
      expectErrorsToMatch(errors, expectedErrors || []);
    }
  );
}

describe("parseFilter", () => {
  describe("parseFilter happy paths", () => {
    testEachCase([
      {
        title: "should parse strings correctly (Mongo)",
        querystring: "filter[name]=kevin",
        expectedResults: { LIKE: ["#name", "%kevin%"] },
      },
      {
        title: "should parse numbers correctly (Mongo)",
        querystring: "filter[age]=3",
        expectedResults: { "=": ["#age", 3] },
      },
      {
        title: "should parse booleans correctly (Mongo)",
        querystring: "filter[active]=true",
        expectedResults: { "=": ["#active", true] },
      },
      {
        title: "should parse $lt correctly (Mongo)",
        querystring: "filter[age][$lt]=3",
        expectedResults: { "<": ["#age", 3] },
      },
      {
        title: "should parse $lte correctly (Mongo)",
        querystring: "filter[age][$lte]=3",
        expectedResults: { "<=": ["#age", 3] },
      },
      {
        title: "should parse $gt correctly (Mongo)",
        querystring: "filter[age][$gt]=3",
        expectedResults: { ">": ["#age", 3] },
      },
      {
        title: "should parse $gte correctly (Mongo)",
        querystring: "filter[age][$gte]=3",
        expectedResults: { ">=": ["#age", 3] },
      },
      {
        title: "should parse strings correctly (IBM)",
        querystring: "filter=contains(name,'kevin')",
        expectedResults: { LIKE: ["#name", "%kevin%"] },
      },
      {
        title: "should parse numbers correctly (IBM)",
        querystring: "filter=equals(age,'3')",
        expectedResults: { "=": ["#age", 3] },
      },
      {
        title: "should parse booleans correctly (IBM)",
        querystring: "filter=equals(active,'true')",
        expectedResults: { "=": ["#active", true] },
      },
      {
        title: "should parse $lt correctly (IBM)",
        querystring: "filter=lessThan(age,'3')",
        expectedResults: { "<": ["#age", 3] },
      },
      {
        title: "should parse $lte correctly (IBM)",
        querystring: "filter=lessOrEqual(age,'3')",
        expectedResults: { "<=": ["#age", 3] },
      },
      {
        title: "should parse $gt correctly (IBM)",
        querystring: "filter=greaterThan(age,'3')",
        expectedResults: { ">": ["#age", 3] },
      },
      {
        title: "should parse $gte correctly (IBM)",
        querystring: "filter=greaterOrEqual(age,'3')",
        expectedResults: { ">=": ["#age", 3] },
      },
      {
        title:
          "should return undefined if querystring does not have filter param",
        querystring: "sort=name",
        expectedResults: undefined,
      },
      {
        title: "should return undefined if querystring is empty string",
        querystring: "",
        expectedResults: undefined,
      },
      {
        title: "should return undefined if querystring is not a string",
        querystring: null,
        expectedResults: undefined,
      },
    ]);
  });

  describe("parseFilter error paths", () => {
    testEachCase([
      {
        title: "should return error when filter style could not be determined",
        querystring: "filter=abc",
        expectedErrors: [
          new QuerystringParsingError({
            message:
              "querystring filter did not match any of the supported styles",
            querystring: "filter=abc",
          }),
        ],
      },
    ]);
  });
});
