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
    },
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
      {
        title: "should return page offset and limit as integers in result",
        querystring: "page[offset]=1&page[limit]=5",
        expectedResults: {
          offset: 1,
          limit: 5,
        },
      },
      {
        title:
          "should return empty object (no pagination) if neither offset nor limit were provided",
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
        title:
          "should return error if number is valid but size was not provided",
        querystring: "page[number]=1",
        expectedErrors: [
          new QuerystringParsingError({
            message: "Page number was provided but page size was not provided.",
            querystring: "page[number]=1",
            paramKey: "page[size]",
            paramValue: "",
          }),
        ],
      },
      {
        title:
          "should return error if number is invalid but size was not provided",
        querystring: "page[number]=0",
        expectedErrors: [
          new QuerystringParsingError({
            message: "Page number should be a positive integer.",
            querystring: "page[number]=0",
            paramKey: "page[number]",
            paramValue: "0",
          }),
          new QuerystringParsingError({
            message: "Page number was provided but page size was not provided.",
            querystring: "page[number]=0",
            paramKey: "page[size]",
            paramValue: "",
          }),
        ],
      },
      {
        title:
          "should return error if size is valid but number was not provided",
        querystring: "page[size]=5",
        expectedErrors: [
          new QuerystringParsingError({
            message: "Page size was provided but page number was not provided.",
            querystring: "page[size]=5",
            paramKey: "page[number]",
            paramValue: "",
          }),
        ],
      },
      {
        title:
          "should return error if size is invalid but number was not provided",
        querystring: "page[size]=0",
        expectedErrors: [
          new QuerystringParsingError({
            message: "Page size was provided but page number was not provided.",
            querystring: "page[size]=0",
            paramKey: "page[number]",
            paramValue: "",
          }),
          new QuerystringParsingError({
            message: "Page size should be a positive integer.",
            querystring: "page[size]=0",
            paramKey: "page[size]",
            paramValue: "0",
          }),
        ],
      },
      {
        title:
          "should return error if invalid value was provided for page number ('nope')",
        querystring: "page[number]=nope&page[size]=5",
        expectedErrors: [
          new QuerystringParsingError({
            message: "Page number should be a positive integer.",
            querystring: "page[number]=nope&page[size]=5",
            paramKey: "page[number]",
            paramValue: "nope",
          }),
        ],
      },
      {
        title:
          "should return error if invalid value was provided for page number (0)",
        querystring: "page[number]=0&page[size]=5",
        expectedErrors: [
          new QuerystringParsingError({
            message: "Page number should be a positive integer.",
            querystring: "page[number]=0&page[size]=5",
            paramKey: "page[number]",
            paramValue: "0",
          }),
        ],
      },
      {
        title:
          "should return error if invalid value was provided for page number (-1)",
        querystring: "page[number]=-1&page[size]=5",
        expectedErrors: [
          new QuerystringParsingError({
            message: "Page number should be a positive integer.",
            querystring: "page[number]=-1&page[size]=5",
            paramKey: "page[number]",
            paramValue: "-1",
          }),
        ],
      },
      {
        title:
          "should return error if invalid value was provided for page number (1.1)",
        querystring: "page[number]=1.1&page[size]=5",
        expectedErrors: [
          new QuerystringParsingError({
            message: "Page number should be a positive integer.",
            querystring: "page[number]=1.1&page[size]=5",
            paramKey: "page[number]",
            paramValue: "1.1",
          }),
        ],
      },
      {
        title:
          "should return error if invalid value was provided for page size ('nope')",
        querystring: "page[number]=1&page[size]=nope",
        expectedErrors: [
          new QuerystringParsingError({
            message: "Page size should be a positive integer.",
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
            message: "Page size should be a positive integer.",
            querystring: "page[number]=1&page[size]=0",
            paramKey: "page[size]",
            paramValue: "0",
          }),
        ],
      },
      {
        title:
          "should return error if invalid value was provided for page size (-1)",
        querystring: "page[number]=1&page[size]=-1",
        expectedErrors: [
          new QuerystringParsingError({
            message: "Page size should be a positive integer.",
            querystring: "page[number]=1&page[size]=-1",
            paramKey: "page[size]",
            paramValue: "-1",
          }),
        ],
      },
      {
        title:
          "should return error if invalid value was provided for page size (1.1)",
        querystring: "page[number]=1&page[size]=1.1",
        expectedErrors: [
          new QuerystringParsingError({
            message: "Page size should be a positive integer.",
            querystring: "page[number]=1&page[size]=1.1",
            paramKey: "page[size]",
            paramValue: "1.1",
          }),
        ],
      },
      {
        title:
          "should return errors if invalid values were provided for both page and size",
        querystring: "page[number]=nope&page[size]=nopedynope",
        expectedErrors: [
          new QuerystringParsingError({
            message: "Page number should be a positive integer.",
            querystring: "page[number]=nope&page[size]=nopedynope",
            paramKey: "page[number]",
            paramValue: "nope",
          }),
          new QuerystringParsingError({
            message: "Page size should be a positive integer.",
            querystring: "page[number]=nope&page[size]=nopedynope",
            paramKey: "page[size]",
            paramValue: "nopedynope",
          }),
        ],
      },
      {
        title:
          "should return error if offset is valid but limit was not provided",
        querystring: "page[offset]=1",
        expectedErrors: [
          new QuerystringParsingError({
            message:
              "Page offset was provided but page limit was not provided.",
            querystring: "page[offset]=1",
            paramKey: "page[limit]",
            paramValue: "",
          }),
        ],
      },
      {
        title:
          "should return error if offset is invalid but limit was not provided",
        querystring: "page[offset]=-1",
        expectedErrors: [
          new QuerystringParsingError({
            message: "Page offset should be a non-negative integer.",
            querystring: "page[offset]=-1",
            paramKey: "page[offset]",
            paramValue: "-1",
          }),
          new QuerystringParsingError({
            message:
              "Page offset was provided but page limit was not provided.",
            querystring: "page[offset]=-1",
            paramKey: "page[limit]",
            paramValue: "",
          }),
        ],
      },
      {
        title:
          "should return error if limit is invalid but offset was not provided",
        querystring: "page[limit]=0",
        expectedErrors: [
          new QuerystringParsingError({
            message: "Page limit should be a positive integer.",
            querystring: "page[limit]=0",
            paramKey: "page[limit]",
            paramValue: "0",
          }),
        ],
      },
      {
        title:
          "should return error if invalid value was provided for page offset ('nope')",
        querystring: "page[offset]=nope&page[limit]=5",
        expectedErrors: [
          new QuerystringParsingError({
            message: "Page offset should be a non-negative integer.",
            querystring: "page[offset]=nope&page[limit]=5",
            paramKey: "page[offset]",
            paramValue: "nope",
          }),
        ],
      },
      {
        title:
          "should return error if invalid value was provided for page offset (-1)",
        querystring: "page[offset]=-1&page[limit]=5",
        expectedErrors: [
          new QuerystringParsingError({
            message: "Page offset should be a non-negative integer.",
            querystring: "page[offset]=-1&page[limit]=5",
            paramKey: "page[offset]",
            paramValue: "-1",
          }),
        ],
      },
      {
        title:
          "should return error if invalid value was provided for page offset (1.1)",
        querystring: "page[offset]=1.1&page[limit]=5",
        expectedErrors: [
          new QuerystringParsingError({
            message: "Page offset should be a non-negative integer.",
            querystring: "page[offset]=1.1&page[limit]=5",
            paramKey: "page[offset]",
            paramValue: "1.1",
          }),
        ],
      },
      {
        title:
          "should return error if invalid value was provided for page limit ('nope')",
        querystring: "page[offset]=1&page[limit]=nope",
        expectedErrors: [
          new QuerystringParsingError({
            message: "Page limit should be a positive integer.",
            querystring: "page[offset]=1&page[limit]=nope",
            paramKey: "page[limit]",
            paramValue: "nope",
          }),
        ],
      },
      {
        title:
          "should return error if invalid value was provided for page limit (0)",
        querystring: "page[offset]=1&page[limit]=0",
        expectedErrors: [
          new QuerystringParsingError({
            message: "Page limit should be a positive integer.",
            querystring: "page[offset]=1&page[limit]=0",
            paramKey: "page[limit]",
            paramValue: "0",
          }),
        ],
      },
      {
        title:
          "should return error if invalid value was provided for page limit (-1)",
        querystring: "page[offset]=1&page[limit]=-1",
        expectedErrors: [
          new QuerystringParsingError({
            message: "Page limit should be a positive integer.",
            querystring: "page[offset]=1&page[limit]=-1",
            paramKey: "page[limit]",
            paramValue: "-1",
          }),
        ],
      },
      {
        title:
          "should return error if invalid value was provided for page limit (1.1)",
        querystring: "page[offset]=1&page[limit]=1.1",
        expectedErrors: [
          new QuerystringParsingError({
            message: "Page limit should be a positive integer.",
            querystring: "page[offset]=1&page[limit]=1.1",
            paramKey: "page[limit]",
            paramValue: "1.1",
          }),
        ],
      },
      {
        title:
          "should return errors if invalid values were provided for both page and limit",
        querystring: "page[offset]=nope&page[limit]=nopedynope",
        expectedErrors: [
          new QuerystringParsingError({
            message: "Page offset should be a non-negative integer.",
            querystring: "page[offset]=nope&page[limit]=nopedynope",
            paramKey: "page[offset]",
            paramValue: "nope",
          }),
          new QuerystringParsingError({
            message: "Page limit should be a positive integer.",
            querystring: "page[offset]=nope&page[limit]=nopedynope",
            paramKey: "page[limit]",
            paramValue: "nopedynope",
          }),
        ],
      },
      {
        title: "should return errors for unsupported params",
        querystring: "page[x]=1&page[y]=2",
        expectedErrors: [
          new QuerystringParsingError({
            message: "Page x is not supported.",
            querystring: "page[x]=1&page[y]=2",
            paramKey: "page[x]",
            paramValue: "1",
          }),
          new QuerystringParsingError({
            message: "Page y is not supported.",
            querystring: "page[x]=1&page[y]=2",
            paramKey: "page[y]",
            paramValue: "2",
          }),
        ],
      },
    ]);
  });
});
