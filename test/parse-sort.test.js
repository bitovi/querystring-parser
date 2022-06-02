const parseSort = require("../lib/parse-sort");
const expectErrorsToMatch = require("./test-utils/expect-errors-to-match");

function testEachCase(testCases) {
  test.concurrent.each(testCases)(
    "$title",
    ({ querystring, expectedResults, expectedErrors }) => {
      const { results, errors } = parseSort(querystring);
      expect(results).toEqual(expectedResults || []);
      expectErrorsToMatch(errors, expectedErrors || []);
    }
  );
}

describe("parseSort", () => {
  describe("parseSort happy paths", () => {
    testEachCase([
      {
        title: "should return an array of sort fields",
        querystring: "sort=-date,name",
        expectedResults: [
          {
            field: "date",
            direction: "DESC",
          },
          {
            field: "name",
            direction: "ASC",
          },
        ],
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
