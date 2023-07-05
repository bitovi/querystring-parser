const parseMeta = require("../lib/parse-meta");
const expectErrorsToMatch = require("./test-utils/expect-errors-to-match");

function testEachCase(testCases) {
  test.concurrent.each(testCases)(
    "$title",
    ({ querystring, expectedResults, expectedErrors }) => {
      const { results, errors } = parseMeta(querystring);
      expect(results).toEqual(expectedResults || []);
      expectErrorsToMatch(errors, expectedErrors || []);
    }
  );
}

describe("parseMeta", () => {
  describe("parseMeta happy paths", () => {
    testEachCase([
      {
        title: "should return an array of meta",
        querystring: "meta=count",
        expectedResults: ["count"],
      },
      {
        title: "should remove empty strings from results",
        querystring: "meta=,,count",
        expectedResults: ["count"],
      },
      {
        title: "should return empty array when querystring is empty string",
        querystring: "",
        expectedResults: [],
      },
      {
        title: "should return empty array when querystring is null",
        querystring: null,
        expectedResults: [],
      },
      {
        title: "should return empty array when querystring is undefined",
        querystring: undefined,
        expectedResults: [],
      },
    ]);
  });
});
