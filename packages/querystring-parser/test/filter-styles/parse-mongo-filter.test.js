const parseMongoFilter = require("../../lib/filter-styles/parse-mongo-filter");
const QuerystringParsingError = require("../../lib/errors/querystring-parsing-error");
const expectErrorsToMatch = require("../test-utils/expect-errors-to-match");

function testEachCase(testCases) {
  test.concurrent.each(testCases)(
    "$title",
    ({ querystring, expectedResults, expectedErrors }) => {
      const { results, errors } = parseMongoFilter(querystring);
      expect(results).toEqual(expectedResults || undefined);
      expectErrorsToMatch(errors, expectedErrors || []);
    },
  );
}

describe("parseMongoFilter() tests", () => {
  describe("$eq mongo operator", () => {
    testEachCase([
      {
        title:
          'the "$eq" mongo operator should map to the "=" sql operator for string values',
        querystring: "filter[name][$eq]=michael",
        expectedResults: { "=": ["#name", "michael"] },
      },
      {
        title:
          'the "$eq" mongo operator should map to the "=" sql operator for number values',
        querystring: "filter[age][$eq]=25",
        expectedResults: { "=": ["#age", 25] },
      },
      {
        title:
          'the "$eq" mongo operator should map to the "=" sql operator for date values',
        querystring: "filter[born][$eq]=2020-01-01",
        expectedResults: { "=": ["#born", "2020-01-01"] },
      },
      {
        title:
          'the "$eq" mongo operator should map to the "IS NULL" sql operator for null values',
        querystring: "filter[age][$eq]=null",
        expectedResults: { "IS NULL": "#age" },
      },
      {
        title: 'the "$eq" mongo operator should not allow array values',
        querystring: "filter[age][$eq]=24,25",
        expectedErrors: [
          new QuerystringParsingError({
            message: '"$eq" operator should not be used with array value',
            querystring: "filter[age][$eq]=24,25",
            paramKey: "filter[age][$eq]",
            paramValue: ["24", "25"],
          }),
        ],
      },
    ]);
  });

  describe("$ne mongo operator", () => {
    testEachCase([
      {
        title:
          'the "$ne" mongo operator should map to the "<>" sql operator for string values',
        querystring: "filter[name][$ne]=michael",
        expectedResults: { "<>": ["#name", "michael"] },
      },
      {
        title:
          'the "$ne" mongo operator should map to the "<>" sql operator for number values',
        querystring: "filter[age][$ne]=25",
        expectedResults: { "<>": ["#age", 25] },
      },
      {
        title:
          'the "$ne" mongo operator should map to the "<>" sql operator for date values',
        querystring: "filter[born][$ne]=2020-01-01",
        expectedResults: { "<>": ["#born", "2020-01-01"] },
      },
      {
        title:
          'the "$ne" mongo operator should map to the "IS NOT NULL" sql operator for null values',
        querystring: "filter[age][$ne]=null",
        expectedResults: { "IS NOT NULL": "#age" },
      },
      {
        title: 'the "$ne" mongo operator should not allow array values',
        querystring: "filter[age][$ne]=24,25",
        expectedErrors: [
          new QuerystringParsingError({
            message: '"$ne" operator should not be used with array value',
            querystring: "filter[age][$ne]=24,25",
            paramKey: "filter[age][$ne]",
            paramValue: ["24", "25"],
          }),
        ],
      },
    ]);
  });

  describe("$gt mongo operator", () => {
    testEachCase([
      {
        title:
          'the "$gt" mongo operator should map to the ">" sql operator for string values',
        querystring: "filter[name][$gt]=michael",
        expectedResults: { ">": ["#name", "michael"] },
      },
      {
        title:
          'the "$gt" mongo operator should map to the ">" sql operator for number values',
        querystring: "filter[age][$gt]=25",
        expectedResults: { ">": ["#age", 25] },
      },
      {
        title:
          'the "$gt" mongo operator should map to the ">" sql operator for date values',
        querystring: "filter[born][$gt]=2020-01-01",
        expectedResults: { ">": ["#born", "2020-01-01"] },
      },
      {
        title: 'the "$gt" mongo operator should not allow null values',
        querystring: "filter[age][$gt]=null",
        expectedErrors: [
          new QuerystringParsingError({
            message: '"$gt" operator should not be used with null value',
            querystring: "filter[age][$gt]=null",
            paramKey: "filter[age][$gt]",
            paramValue: "null",
          }),
        ],
      },
      {
        title: 'the "$gt" mongo operator should not allow array values',
        querystring: "filter[age][$gt]=24,25",
        expectedErrors: [
          new QuerystringParsingError({
            message: '"$gt" operator should not be used with array value',
            querystring: "filter[age][$gt]=24,25",
            paramKey: "filter[age][$gt]",
            paramValue: ["24", "25"],
          }),
        ],
      },
    ]);
  });

  describe("$gte mongo operator", () => {
    testEachCase([
      {
        title:
          'the "$gte" mongo operator should map to the ">=" sql operator for string values',
        querystring: "filter[name][$gte]=michael",
        expectedResults: { ">=": ["#name", "michael"] },
      },
      {
        title:
          'the "$gte" mongo operator should map to the ">=" sql operator for number values',
        querystring: "filter[age][$gte]=25",
        expectedResults: { ">=": ["#age", 25] },
      },
      {
        title:
          'the "$gte" mongo operator should map to the ">=" sql operator for date values',
        querystring: "filter[born][$gte]=2020-01-01",
        expectedResults: { ">=": ["#born", "2020-01-01"] },
      },
      {
        title: 'the "$gte" mongo operator should not allow null values',
        querystring: "filter[age][$gte]=null",
        expectedErrors: [
          new QuerystringParsingError({
            message: '"$gte" operator should not be used with null value',
            querystring: "filter[age][$gte]=null",
            paramKey: "filter[age][$gte]",
            paramValue: "null",
          }),
        ],
      },
      {
        title: 'the "$gte" mongo operator should not allow array values',
        querystring: "filter[age][$gte]=24,25",
        expectedErrors: [
          new QuerystringParsingError({
            message: '"$gte" operator should not be used with array value',
            querystring: "filter[age][$gte]=24,25",
            paramKey: "filter[age][$gte]",
            paramValue: ["24", "25"],
          }),
        ],
      },
    ]);
  });

  describe("$lt mongo operator", () => {
    testEachCase([
      {
        title:
          'the "$lt" mongo operator should map to the "<" sql operator for string values',
        querystring: "filter[name][$lt]=michael",
        expectedResults: { "<": ["#name", "michael"] },
      },
      {
        title:
          'the "$lt" mongo operator should map to the "<" sql operator for number values',
        querystring: "filter[age][$lt]=25",
        expectedResults: { "<": ["#age", 25] },
      },
      {
        title:
          'the "$lt" mongo operator should map to the "<" sql operator for date values',
        querystring: "filter[born][$lt]=2020-01-01",
        expectedResults: { "<": ["#born", "2020-01-01"] },
      },
      {
        title: 'the "$lt" mongo operator should not allow null values',
        querystring: "filter[age][$lt]=null",
        expectedErrors: [
          new QuerystringParsingError({
            message: '"$lt" operator should not be used with null value',
            querystring: "filter[age][$lt]=null",
            paramKey: "filter[age][$lt]",
            paramValue: "null",
          }),
        ],
      },
      {
        title: 'the "$lt" mongo operator should not allow array values',
        querystring: "filter[age][$lt]=24,25",
        expectedErrors: [
          new QuerystringParsingError({
            message: '"$lt" operator should not be used with array value',
            querystring: "filter[age][$lt]=24,25",
            paramKey: "filter[age][$lt]",
            paramValue: ["24", "25"],
          }),
        ],
      },
    ]);
  });

  describe("$lte mongo operator", () => {
    testEachCase([
      {
        title:
          'the "$lte" mongo operator should map to the "<=" sql operator for string values',
        querystring: "filter[name][$lte]=michael",
        expectedResults: { "<=": ["#name", "michael"] },
      },
      {
        title:
          'the "$lte" mongo operator should map to the "<=" sql operator for number values',
        querystring: "filter[age][$lte]=25",
        expectedResults: { "<=": ["#age", 25] },
      },
      {
        title:
          'the "$lte" mongo operator should map to the "<=" sql operator for date values',
        querystring: "filter[born][$lte]=2020-01-01",
        expectedResults: { "<=": ["#born", "2020-01-01"] },
      },
      {
        title: 'the "$lte" mongo operator should not allow null values',
        querystring: "filter[age][$lte]=null",
        expectedErrors: [
          new QuerystringParsingError({
            message: '"$lte" operator should not be used with null value',
            querystring: "filter[age][$lte]=null",
            paramKey: "filter[age][$lte]",
            paramValue: "null",
          }),
        ],
      },
      {
        title: 'the "$lte" mongo operator should not allow array values',
        querystring: "filter[age][$lte]=24,25",
        expectedErrors: [
          new QuerystringParsingError({
            message: '"$lte" operator should not be used with array value',
            querystring: "filter[age][$lte]=24,25",
            paramKey: "filter[age][$lte]",
            paramValue: ["24", "25"],
          }),
        ],
      },
    ]);
  });

  describe("$ilike mongo operator", () => {
    testEachCase([
      {
        title:
          'the "$ilike" mongo operator should map to the "ilike" sql operator for string values',
        querystring: "filter[name][$ilike]=michael",
        expectedResults: { ILIKE: ["#name", "michael"] },
      },
      {
        title: 'the "$ilike" mongo operator should not allow number values',
        querystring: "filter[age][$ilike]=25",
        expectedErrors: [
          new QuerystringParsingError({
            message: '"$ilike" operator should not be used with number values',
            querystring: "filter[age][$ilike]=25",
            paramKey: "filter[age][$ilike]",
            paramValue: "25",
          }),
        ],
      },
      {
        title: 'the "$ilike" mongo operator should not allow date values',
        querystring: "filter[born][$ilike]=2020-01-01",
        expectedErrors: [
          new QuerystringParsingError({
            message: '"$ilike" operator should not be used with date values',
            querystring: "filter[born][$ilike]=2020-01-01",
            paramKey: "filter[born][$ilike]",
            paramValue: "2020-01-01",
          }),
        ],
      },
      {
        title: 'the "$ilike" mongo operator should not allow null values',
        querystring: "filter[name][$ilike]=null",
        expectedErrors: [
          new QuerystringParsingError({
            message: '"$ilike" operator should not be used with null value',
            querystring: "filter[name][$ilike]=null",
            paramKey: "filter[name][$ilike]",
            paramValue: "null",
          }),
        ],
      },
    ]);
  });

  describe("$in mongo operator", () => {
    testEachCase([
      {
        title:
          'the "$in" mongo operator should map to the "IN" sql operator for multiple string value',
        querystring: "filter[name][$in]=michael,brad",
        expectedResults: { IN: ["#name", "michael", "brad"] },
      },
      {
        title:
          'the "$in" mongo operator should map to the "IN" sql operator for singular string values (auto-wrapping)',
        querystring: "filter[name][$in]=michael",
        expectedResults: { IN: ["#name", "michael"] },
      },
      {
        title:
          'the "$in" mongo operator should map to the "IN" sql operator for multiple number values',
        querystring: "filter[age][$in]=24,25",
        expectedResults: { IN: ["#age", 24, 25] },
      },
      {
        title:
          'the "$in" mongo operator should map to the "IN" sql operator for singular number values (auto-wrapping)',
        querystring: "filter[age][$in]=25",
        expectedResults: { IN: ["#age", 25] },
      },
      {
        title:
          'the "$in" mongo operator should map to the "IN" sql operator for multiple date value',
        querystring: "filter[born][$in]=2020-01-01,2021-01-01",
        expectedResults: { IN: ["#born", "2020-01-01", "2021-01-01"] },
      },
      {
        title:
          'the "$in" mongo operator should map to the "IN" sql operator for singular date values (auto-wrapping)',
        querystring: "filter[born][$in]=2020-01-01",
        expectedResults: { IN: ["#born", "2020-01-01"] },
      },
      {
        title:
          'the "$in" mongo operator should map to the "IN" sql operator for singular null value (auto-wrapping)',
        querystring: "filter[age][$in]=null",
        expectedResults: { IN: ["#age", null] },
      },
    ]);
  });

  describe("$nin mongo operator", () => {
    testEachCase([
      {
        title:
          'the "$nin" mongo operator should map to the "NOT IN" sql operator for multiple string values',
        querystring: "filter[name][$nin]=michael,brad",
        expectedResults: { "NOT IN": ["#name", "michael", "brad"] },
      },
      {
        title:
          'the "$nin" mongo operator should map to the "NOT IN" sql operator for singular string value (auto-wrapping)',
        querystring: "filter[name][$nin]=michael",
        expectedResults: { "NOT IN": ["#name", "michael"] },
      },
      {
        title:
          'the "$nin" mongo operator should map to the "NOT IN" sql operator for multiple number values',
        querystring: "filter[age][$nin]=24,25",
        expectedResults: { "NOT IN": ["#age", 24, 25] },
      },
      {
        title:
          'the "$nin" mongo operator should map to the "NOT IN" sql operator for singular number value (auto-wrapping)',
        querystring: "filter[age][$nin]=25",
        expectedResults: { "NOT IN": ["#age", 25] },
      },
      {
        title:
          'the "$nin" mongo operator should map to the "NOT IN" sql operator for multiple date values',
        querystring: "filter[born][$nin]=2020-01-01,2021-01-01",
        expectedResults: { "NOT IN": ["#born", "2020-01-01", "2021-01-01"] },
      },
      {
        title:
          'the "$nin" mongo operator should map to the "NOT IN" sql operator for singular date value (auto-wrapping)',
        querystring: "filter[born][$nin]=2020-01-01",
        expectedResults: { "NOT IN": ["#born", "2020-01-01"] },
      },
      {
        title:
          'the "$nin" mongo operator should map to the "NOT IN" sql operator for singular null value (auto-wrapping)',
        querystring: "filter[age][$nin]=null",
        expectedResults: { "NOT IN": ["#age", null] },
      },
    ]);
  });

  describe("implicit/omitted/default operator", () => {
    testEachCase([
      {
        title:
          'the "EQUALS" sql operator should be the default for string values',
        querystring: "filter[name]=michael",
        expectedResults: { "=": ["#name", "michael"] },
      },
      {
        title: 'the "=" sql operator should be the default for number values',
        querystring: "filter[age]=25",
        expectedResults: { "=": ["#age", 25] },
      },
      {
        title: 'the "=" sql operator should be the default for date values',
        querystring: "filter[born]=2020-01-01",
        expectedResults: { "=": ["#born", "2020-01-01"] },
      },
      {
        title:
          'the "IS NULL" sql operator should be the default for null values',
        querystring: "filter[age]=null",
        expectedResults: { "IS NULL": "#age" },
      },

      // Array types
      {
        title:
          'the "IN" sql operator should be the default for string[] (string array) values',
        querystring: "filter[name]=michael,brad",
        expectedResults: { IN: ["#name", "michael", "brad"] },
      },
      {
        title:
          'the "IN" sql operator should be the default for string[] (string array) values (null included)',
        querystring: "filter[name]=michael,null",
        expectedResults: { IN: ["#name", "michael", null] },
      },
      {
        title:
          'the "IN" sql operator should be the default for number[] (number array) values',
        querystring: "filter[age]=24,25",
        expectedResults: { IN: ["#age", 24, 25] },
      },
      {
        title:
          'the "IN" sql operator should be the default for number[] (number array) values (null included)',
        querystring: "filter[age]=24,null",
        expectedResults: { IN: ["#age", 24, null] },
      },
      {
        title:
          'the "IN" sql operator should be the default for date[] (date array) values',
        querystring: "filter[born]=2020-01-01,2021-01-01",
        expectedResults: { IN: ["#born", "2020-01-01", "2021-01-01"] },
      },
      {
        title:
          'the "IN" sql operator should be the default for date[] (date array) values (null included)',
        querystring: "filter[born]=2020-01-01,null",
        expectedResults: { IN: ["#born", "2020-01-01", null] },
      },
    ]);
  });

  describe("multiple filters", () => {
    testEachCase([
      {
        title:
          "multiple filters should be join together in an AND fashion (ex: 2)",
        querystring: "filter[name]=michael&filter[age]=25",
        expectedResults: {
          AND: [{ "=": ["#name", "michael"] }, { "=": ["#age", 25] }],
        },
      },
      {
        title:
          "multiple filters should be join together in an AND fashion (ex: 3)",
        querystring:
          "filter[name]=michael&filter[age]=25&filter[born]=2020-01-01",
        expectedResults: {
          AND: [
            { AND: [{ "=": ["#name", "michael"] }, { "=": ["#age", 25] }] },
            { "=": ["#born", "2020-01-01"] },
          ],
        },
      },
      {
        title: "should be able to use multiple filters on the same attribute",
        querystring: "filter[age][$gt]=0&filter[age][$lt]=5",
        expectedResults: {
          AND: [{ ">": ["#age", 0] }, { "<": ["#age", 5] }],
        },
      },
      {
        title:
          "should be able to use multiple filters on the same attribute (implicit + explicit operators)",
        querystring: "filter[name]=ad&filter[name][$eq]=brad",
        expectedResults: {
          AND: [{ "=": ["#name", "ad"] }, { "=": ["#name", "brad"] }],
        },
      },
    ]);
  });

  describe("other errors", () => {
    testEachCase([
      {
        title: "array values should not permit multiple types (except null)",
        querystring: "filter[name][$in]=michael,25,2020-01-01",
        expectedErrors: [
          new QuerystringParsingError({
            message: "arrays should not mix multiple value types",
            querystring: "filter[name][$in]=michael,25,2020-01-01",
            paramKey: "filter[name][$in]",
            paramValue: ["michael", "25", "2020-01-01"],
          }),
        ],
      },
    ]);
  });
});
