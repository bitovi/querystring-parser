const parseFields = require("../lib/parse-fields");
const QuerystringParsingError = require("../lib/errors/querystring-parsing-error");
const expectErrorsToMatch = require("./test-utils/expect-errors-to-match");

function testEachCase(testCases) {
  test.concurrent.each(testCases)(
    "$title",
    ({ querystring, expectedResults, expectedErrors }) => {
      const { results, errors } = parseFields(querystring);
      expect(results).toEqual(expectedResults || {});
      expectErrorsToMatch(errors, expectedErrors || []);
    },
  );
}

describe("parseFields", () => {
  describe("parseFields happy paths", () => {
    testEachCase([
      {
        title: "should skip empty string values (fields[]=)",
        querystring: "fields[]=",
        expectedResults: {},
      },
      {
        title: "should skip empty string values (fields[articles]=)",
        querystring: "fields[articles]=",
        expectedResults: {},
      },
      {
        title:
          "should skip empty string values (fields[articles]=&fields[people]=name)",
        querystring: "fields[articles]=&fields[people]=name",
        expectedResults: {
          people: ["name"],
        },
      },
      {
        title: "should return single type with single field",
        querystring: "fields[articles]=title",
        expectedResults: {
          articles: ["title"],
        },
      },
      {
        title: "should return single type with multiple fields",
        querystring: "fields[articles]=title,body",
        expectedResults: {
          articles: ["title", "body"],
        },
      },
      {
        title: "should fields for multiple types",
        querystring:
          "fields[articles]=title,body&fields[articles]=abstract&fields[people]=name",
        expectedResults: {
          articles: ["title", "body", "abstract"],
          people: ["name"],
        },
      },
      {
        title:
          "should return single type with multiple fields (multiple params)",
        querystring: "fields[articles]=title&fields[articles]=body",
        expectedResults: {
          articles: ["title", "body"],
        },
      },
      {
        title: "should return empty object when querystring is empty string",
        querystring: "",
        expectedResults: {},
      },
      {
        title: "should return empty object when querystring is null",
        querystring: null,
        expectedResults: {},
      },
      {
        title: "should return empty object when querystring is undefined",
        querystring: undefined,
        expectedResults: {},
      },
      {
        title: "should remove duplicate fields",
        querystring:
          "fields[cats]=name,name&fields[dogs]=name&fields[dogs]=name&fields[snakes]=name",
        expectedResults: {
          cats: ["name"],
          dogs: ["name"],
          snakes: ["name"],
        },
      },
      {
        title: "should support attributes for main table",
        querystring: "fields[]=title",
        expectedResults: {
          "": ["title"],
        },
      },
    ]);
  });

  describe("parseFields error paths", () => {
    testEachCase([
      {
        title: "should skip empty string values (fields)",
        querystring: "fields",
        expectedErrors: [
          new QuerystringParsingError({
            message: "Incorrect format was provided for fields.",
            querystring: "fields",
            paramKey: "fields",
            paramValue: [""],
          }),
        ],
      },
      {
        title: "should skip empty string values (fields=)",
        querystring: "fields=",
        expectedErrors: [
          new QuerystringParsingError({
            message: "Incorrect format was provided for fields.",
            querystring: "fields=",
            paramKey: "fields",
            paramValue: [""],
          }),
        ],
      },
      {
        title:
          "should return return error when the type could not be parsed (fields=title)",
        querystring: "fields=title",
        expectedErrors: [
          new QuerystringParsingError({
            message: "Incorrect format was provided for fields.",
            querystring: "fields=title",
            paramKey: "fields",
            paramValue: ["title"],
          }),
        ],
      },
    ]);
  });
});
