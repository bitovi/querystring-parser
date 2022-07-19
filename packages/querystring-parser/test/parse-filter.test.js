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
