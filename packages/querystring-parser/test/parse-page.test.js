const parsePage = require("../lib/parse-page");
const QuerystringParsingError = require("../lib/errors/querystring-parsing-error");
const expectErrorsToMatch = require("./test-utils/expect-errors-to-match");

function testEachCase(testCases) {
  test.concurrent.each(testCases)(
    "$title",
    ({ querystring, expectedResults, expectedErrors }) => {
      const { results, errors } = parsePage(querystring);
      expect(results).toEqual(expectedResults || {});
      expectErrorsToMatch(errors, expectedErrors || []);
    }
  );
}

describe("parsePage", () => {
  describe("parsePage happy paths", () => {
    testEachCase([
      {
        title: "should return page number and size as integers in result",
        querystring: "page[number]=1&page[size]=5",
        expectedResults: {
          number: 1,
          size: 5,
        },
      },
      {
        title:
          "should return empty object (no pagination) if neither number nor size were provided",
        querystring: "fields[articles]=author",
        expectedResults: {},
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
    ]);
  });

  describe("parsePage error paths", () => {
    testEachCase([
      {
        title: "should return error if number was provided but size was not",
        querystring: "page[number]=1",
        expectedErrors: [
          new QuerystringParsingError({
            message: "Page number was provided but page size was not provided.",
            querystring: "page[number]=1",
            paramKey: "page[number]",
            paramValue: "1",
          }),
        ],
      },
      {
        title: "should return error if size was provided but number was not",
        querystring: "page[size]=5",
        expectedErrors: [
          new QuerystringParsingError({
            message: "Page size was provided but page number was not provided.",
            querystring: "page[size]=5",
            paramKey: "page[size]",
            paramValue: "5",
          }),
        ],
      },
      {
        title:
          "should return error if invalid value was provided for page number ('nope')",
        querystring: "page[number]=nope&page[size]=5",
        expectedErrors: [
          new QuerystringParsingError({
            message: "Invalid page number was provided.",
            querystring: "page[number]=nope&page[size]=5",
            paramKey: "page[number]",
            paramValue: "nope",
          }),
        ],
      },
      {
        title:
          "should return error if invalid value was provided for page number (-1)",
        querystring: "page[number]=-1&page[size]=5",
        expectedErrors: [
          new QuerystringParsingError({
            message: "Invalid page number was provided.",
            querystring: "page[number]=-1&page[size]=5",
            paramKey: "page[number]",
            paramValue: "-1",
          }),
        ],
      },
      {
        title:
          "should return error if invalid value was provided for page size ('nope')",
        querystring: "page[number]=1&page[size]=nope",
        expectedErrors: [
          new QuerystringParsingError({
            message: "Invalid page size was provided.",
            querystring: "page[number]=1&page[size]=nope",
            paramKey: "page[size]",
            paramValue: "nope",
          }),
        ],
      },
      {
        title:
          "should return error if invalid value was provided for page size (0)",
        querystring: "page[number]=1&page[size]=0",
        expectedErrors: [
          new QuerystringParsingError({
            message: "Invalid page size was provided.",
            querystring: "page[number]=1&page[size]=0",
            paramKey: "page[size]",
            paramValue: "0",
          }),
        ],
      },
      {
        title:
          "should return errors if invalid values were provided for both page and size",
        querystring: "page[number]=nope&page[size]=nopedynope",
        expectedErrors: [
          new QuerystringParsingError({
            message: "Invalid page number was provided.",
            querystring: "page[number]=nope&page[size]=nopedynope",
            paramKey: "page[number]",
            paramValue: "nope",
          }),
          new QuerystringParsingError({
            message: "Invalid page size was provided.",
            querystring: "page[number]=nope&page[size]=nopedynope",
            paramKey: "page[size]",
            paramValue: "nopedynope",
          }),
        ],
      },
    ]);
  });
});
