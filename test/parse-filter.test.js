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
    // could use some sanity tests
    // testEachCase([]);
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
