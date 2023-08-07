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
      // string
      {
        title: "should parse strings correctly with the $eq operator (Mongo)",
        querystring: "filter[name][$eq]=John",
        expectedResults: { "=": ["#name", "John"] },
      },
      {
        title: "should parse strings correctly with the $ne operator (Mongo)",
        querystring: "filter[name][$ne]=John",
        expectedResults: { "<>": ["#name", "John"] },
      },
      {
        title: "should parse strings correctly with the $gt operator (Mongo)",
        querystring: "filter[name][$gt]=Jane",
        expectedResults: { ">": ["#name", "Jane"] },
      },
      {
        title: "should parse strings correctly with the $gte operator (Mongo)",
        querystring: "filter[name][$gte]=Jane",
        expectedResults: { ">=": ["#name", "Jane"] },
      },
      {
        title: "should parse strings correctly with the $lt operator (Mongo)",
        querystring: "filter[name][$lt]=John",
        expectedResults: { "<": ["#name", "John"] },
      },
      {
        title: "should parse strings correctly with the $lte operator (Mongo)",
        querystring: "filter[name][$lte]=John",
        expectedResults: { "<=": ["#name", "John"] },
      },
      {
        title: "should parse strings correctly with the $in operator (Mongo)",
        querystring: "filter[name][$in]=John&filter[name][$in]=Jane",
        expectedResults: { IN: ["#name", "John", "Jane"] },
      },
      {
        title: "should parse strings correctly with the $nin operator (Mongo)",
        querystring: "filter[name][$nin]=John&filter[name][$nin]=Jane",
        expectedResults: { "NOT IN": ["#name", "John", "Jane"] },
      },
      {
        title:
          "should parse strings correctly with the $like operator - end of string (Mongo)",
        querystring: `filter[name][$like]=${encodeURIComponent("%ne")}`,
        expectedResults: {
          LIKE: ["#name", "%ne"],
        },
      },
      {
        title:
          "should parse strings correctly with the $like operator - beginning of string (Mongo)",
        querystring: `filter[name][$like]=${encodeURIComponent("Jo%")}`,
        expectedResults: {
          LIKE: ["#name", "Jo%"],
        },
      },
      {
        title:
          "should parse strings correctly with the $like operator - contains string (Mongo)",
        querystring: `filter[name][$like]=${encodeURIComponent("%an%")}`,
        expectedResults: {
          LIKE: ["#name", "%an%"],
        },
      },
      {
        title:
          "should parse strings correctly with the $like operator - entire string (Mongo)",
        querystring: "filter[name][$like]=john",
        expectedResults: {
          LIKE: ["#name", "john"],
        },
      },
      {
        title:
          "should parse strings correctly with the $ilike operator - end of string (Mongo)",
        querystring: `filter[name][$ilike]=${encodeURIComponent("%NE")}`,
        expectedResults: {
          ILIKE: ["#name", "%NE"],
        },
      },
      {
        title:
          "should parse strings correctly with the $ilike operator - beginning of string (Mongo)",
        querystring: `filter[name][$ilike]=${encodeURIComponent("JO%")}`,
        expectedResults: {
          ILIKE: ["#name", "JO%"],
        },
      },
      {
        title:
          "should parse strings correctly with the $ilike operator - contains string (Mongo)",
        querystring: `filter[name][$ilike]=${encodeURIComponent("%An%")}`,
        expectedResults: {
          ILIKE: ["#name", "%An%"],
        },
      },
      {
        title:
          "should parse strings correctly with the $ilike operator - entire string (Mongo)",
        querystring: "filter[name][$ilike]=jOhN",
        expectedResults: {
          ILIKE: ["#name", "jOhN"],
        },
      },
      // numbers
      {
        title: "should parse numbers correctly with the $eq operator (Mongo)",
        querystring: "filter[age][$eq]=35",
        expectedResults: { "=": ["#age", 35] },
      },
      {
        title: "should parse numbers correctly with the $ne operator (Mongo)",
        querystring: "filter[age][$ne]=35",
        expectedResults: { "<>": ["#age", 35] },
      },
      {
        title: "should parse numbers correctly with the $gt operator (Mongo)",
        querystring: "filter[age][$gt]=30",
        expectedResults: { ">": ["#age", 30] },
      },
      {
        title: "should parse numbers correctly with the $lt operator (Mongo)",
        querystring: "filter[age][$lt]=30",
        expectedResults: { "<": ["#age", 30] },
      },
      {
        title: "returns correct data using the $lte operator with a number",
        querystring: "filter[age][$lte]=25",
        expectedResults: { "<=": ["#age", 25] },
      },
      {
        title: "returns correct data using the $gte operator with a number",
        querystring: "filter[age][$gte]=35",
        expectedResults: { ">=": ["#age", 35] },
      },
      {
        title: "should parse numbers correctly with the $in operator (Mongo)",
        querystring: "filter[age][$in]=25&filter[age][$in]=35",
        expectedResults: { IN: ["#age", 25, 35] },
      },
      {
        title: "should parse numbers correctly with the $nin operator (Mongo)",
        querystring: "filter[age][$nin]=25&filter[age][$nin]=35",
        expectedResults: { "NOT IN": ["#age", 25, 35] },
      },
      //arrays
      {
        title: "should parse arrays correctly with the $in operator (Mongo)",
        querystring: "filter[name][$in]=John&filter[name][$in]=Jane",
        expectedResults: { IN: ["#name", "John", "Jane"] },
      },
      {
        title: "should parse arrays correctly with the $nin operator (Mongo)",
        querystring: "filter[name][$nin]=John&filter[name][$nin]=Jane",
        expectedResults: { "NOT IN": ["#name", "John", "Jane"] },
      },
      //date
      {
        title: "should parse dates correctly with the $eq operator (Mongo)",
        querystring: "filter[startDate][$eq]=2020-05-05T00:00:00.000Z",
        expectedResults: { "=": ["#startDate", "2020-05-05T00:00:00.000Z"] },
      },
      {
        title: "should parse dates correctly with the $ne operator (Mongo)",
        querystring: "filter[startDate][$ne]=2020-05-05T00:00:00.000Z",
        expectedResults: { "<>": ["#startDate", "2020-05-05T00:00:00.000Z"] },
      },
      {
        title: "should parse dates correctly with the $gt operator (Mongo)",
        querystring: "filter[startDate][$gt]=2020-12-12",
        expectedResults: { ">": ["#startDate", "2020-12-12"] },
      },
      {
        title: "should parse dates correctly with the $lt operator (Mongo)",
        querystring: "filter[startDate][$lt]=2020-12-12",
        expectedResults: { "<": ["#startDate", "2020-12-12"] },
      },
      {
        title: "should parse dates correctly with the $lte operator (Mongo)",
        querystring: "filter[startDate][$lte]=2020-05-05",
        expectedResults: { "<=": ["#startDate", "2020-05-05"] },
      },
      {
        title: "returns correct data using the $gte operator with a date",
        querystring: "filter[startDate][$gte]=2021-01-05",
        expectedResults: { ">=": ["#startDate", "2021-01-05"] },
      },
      {
        title: "should parse dates correctly with the $in operator (Mongo)",
        querystring:
          "filter[startDate][$in]=2020-05-05T00:00:00.000Z&filter[startDate][$in]=2021-01-05T00:00:00.000Z",
        expectedResults: {
          IN: [
            "#startDate",
            "2020-05-05T00:00:00.000Z",
            "2021-01-05T00:00:00.000Z",
          ],
        },
      },
      {
        title: "should parse dates correctly with the $nin operator (Mongo)",
        querystring:
          "filter[startDate][$nin]=2020-05-05T00:00:00.000Z&filter[startDate][$nin]=2021-01-05T00:00:00.000Z",
        expectedResults: {
          "NOT IN": [
            "#startDate",
            "2020-05-05T00:00:00.000Z",
            "2021-01-05T00:00:00.000Z",
          ],
        },
      },
      //boolean
      {
        title: "should parse booleans correctly with the $eq operator (Mongo)",
        querystring: "filter[onSite][$eq]=true",
        expectedResults: { "=": ["#onSite", true] },
      },
      {
        title: "should parse booleans correctly with the $in operator (Mongo)",
        querystring: "filter[onSite][$in]=true&filter[manager][$in]=false",
        expectedResults: {
          AND: [{ IN: ["#onSite", true] }, { IN: ["#manager", false] }],
        },
      },
      {
        title: "should parse booleans correctly with the $nin operator (Mongo)",
        querystring: "filter[onSite][$nin]=true&filter[manager][$nin]=true",
        expectedResults: {
          AND: [
            { "NOT IN": ["#onSite", true] },
            { "NOT IN": ["#manager", true] },
          ],
        },
      },
      // no operators
      {
        title: "should parse strings correctly (Mongo)",
        querystring: "filter[name]=kevin",
        expectedResults: { ILIKE: ["#name", "kevin"] },
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
      // remaining / IBM
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
