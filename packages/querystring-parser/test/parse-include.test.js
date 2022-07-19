const parseInclude = require("../lib/parse-include");
const expectErrorsToMatch = require("./test-utils/expect-errors-to-match");

function testEachCase(testCases) {
  test.concurrent.each(testCases)(
    "$title",
    ({ querystring, expectedResults, expectedErrors }) => {
      const { results, errors } = parseInclude(querystring);
      expect(results).toEqual(expectedResults || []);
      expectErrorsToMatch(errors, expectedErrors || []);
    }
  );
}

describe("parseInclude", () => {
  describe("parseInclude happy paths", () => {
    testEachCase([
      {
        title: "should return an array of relationship paths",
        querystring:
          "include=children.movies.actors.children,children.movies.actors.pets,children.pets,pets",
        expectedResults: [
          "children.movies.actors.children",
          "children.movies.actors.pets",
          "children.pets",
          "pets",
        ],
      },
      {
        title: "should remove empty strings from results",
        querystring: "include=,,pets",
        expectedResults: ["pets"],
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
