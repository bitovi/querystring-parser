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
        title: "should parse strings correctly",
        querystring: "filter[name]=kevin",
        expectedResults: { LIKE: ["#name", "%kevin%"] },
      },
      {
        title: "should parse numbers correctly",
        querystring: "filter[age]=3",
        expectedResults: { "=": ["#age", 3] },
      },
      {
        title: "should parse booleans correctly",
        querystring: "filter[active]=true",
        expectedResults: { "=": ["#active", true] },
      },
      {
        title: "should parse strings correctly",
        querystring: "filter=contains(name,'kevin')",
        expectedResults: { LIKE: ["#name", "%kevin%"] },
      },
      {
        title: "should parse numbers correctly",
        querystring: "filter=equals(age,'3')",
        expectedResults: { "=": ["#age", 3] },
      },
      {
        title: "should parse booleans correctly",
        querystring: "filter=equals(active,'true')",
        expectedResults: { "=": ["#active", true] },
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
