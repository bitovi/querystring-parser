const parseIbmFilter = require("../../lib/filter-styles/parse-ibm-filter");
const QuerystringParsingError = require("../../lib/errors/querystring-parsing-error");
const expectErrorsToMatch = require("../test-utils/expect-errors-to-match");

function testEachCase(testCases) {
  test.concurrent.each(testCases)(
    "$title",
    ({ querystring, expectedResults, expectedErrors }) => {
      const { results, errors } = parseIbmFilter(querystring);
      expect(results).toEqual(expectedResults || undefined);
      expectErrorsToMatch(errors, expectedErrors || []);
    },
  );
}

describe("parseIbmFilter() tests", () => {
  describe("equals ibm operator", () => {
    testEachCase([
      {
        title:
          'the "equals" ibm operator should map to the "=" sql operator for string values',
        querystring: "filter=equals(name,'michael')",
        expectedResults: { "=": ["#name", "michael"] },
      },
      {
        title:
          'the "equals" ibm operator should map to the "=" sql operator for number values',
        querystring: "filter=equals(age,'25')",
        expectedResults: { "=": ["#age", 25] },
      },
      {
        title:
          'the "equals" ibm operator should map to the "=" sql operator for date values',
        querystring: "filter=equals(born,'2020-01-01')",
        expectedResults: { "=": ["#born", "2020-01-01"] },
      },
      {
        title:
          'the "equals" ibm operator should map to the "=" sql operator for attribute references',
        querystring: "filter=equals(wins,losses)",
        expectedResults: { "=": ["#wins", "#losses"] },
      },
      {
        title:
          'the "equals" ibm operator should map to the "IS NULL" sql operator for null values',
        querystring: "filter=equals(age,null)",
        expectedResults: { "IS NULL": "#age" },
      },
    ]);
  });

  describe("greaterThan ibm operator", () => {
    testEachCase([
      {
        title:
          'the "greaterThan" ibm operator should map to the ">" sql operator for string values',
        querystring: "filter=greaterThan(name,'michael')",
        expectedResults: { ">": ["#name", "michael"] },
      },
      {
        title:
          'the "greaterThan" ibm operator should map to the ">" sql operator for number values',
        querystring: "filter=greaterThan(age,'25')",
        expectedResults: { ">": ["#age", 25] },
      },
      {
        title:
          'the "greaterThan" ibm operator should map to the ">" sql operator for date values',
        querystring: "filter=greaterThan(born,'2020-01-01')",
        expectedResults: { ">": ["#born", "2020-01-01"] },
      },
      {
        title:
          'the "greaterThan" ibm operator should map to the ">" sql operator for attribute references',
        querystring: "filter=greaterThan(wins,losses)",
        expectedResults: { ">": ["#wins", "#losses"] },
      },
      {
        title: 'the "greaterThan" ibm operator should not allow null values',
        querystring: "filter=greaterThan(age,null)",
        expectedErrors: [
          new QuerystringParsingError({
            message:
              '"greaterThan" operator should not be used with NULL value',
            querystring: "filter=greaterThan(age,null)",
            paramKey: "filter",
            paramValue: "greaterThan(age,null)",
          }),
        ],
      },
    ]);
  });

  describe("greaterOrEqual ibm operator", () => {
    testEachCase([
      {
        title:
          'the "greaterOrEqual" ibm operator should map to the ">=" sql operator for string values',
        querystring: "filter=greaterOrEqual(name,'michael')",
        expectedResults: { ">=": ["#name", "michael"] },
      },
      {
        title:
          'the "greaterOrEqual" ibm operator should map to the ">=" sql operator for number values',
        querystring: "filter=greaterOrEqual(age,'25')",
        expectedResults: { ">=": ["#age", 25] },
      },
      {
        title:
          'the "greaterOrEqual" ibm operator should map to the ">=" sql operator for date values',
        querystring: "filter=greaterOrEqual(born,'2020-01-01')",
        expectedResults: { ">=": ["#born", "2020-01-01"] },
      },
      {
        title:
          'the "greaterOrEqual" ibm operator should map to the ">=" sql operator for attribute references',
        querystring: "filter=greaterOrEqual(wins,losses)",
        expectedResults: { ">=": ["#wins", "#losses"] },
      },
      {
        title: 'the "greaterOrEqual" ibm operator should not allow null values',
        querystring: "filter=greaterOrEqual(age,null)",
        expectedErrors: [
          new QuerystringParsingError({
            message:
              '"greaterOrEqual" operator should not be used with NULL value',
            querystring: "filter=greaterOrEqual(age,null)",
            paramKey: "filter",
            paramValue: "greaterOrEqual(age,null)",
          }),
        ],
      },
    ]);
  });

  describe("lessThan ibm operator", () => {
    testEachCase([
      {
        title:
          'the "lessThan" ibm operator should map to the "<" sql operator for string values',
        querystring: "filter=lessThan(name,'michael')",
        expectedResults: { "<": ["#name", "michael"] },
      },
      {
        title:
          'the "lessThan" ibm operator should map to the "<" sql operator for number values',
        querystring: "filter=lessThan(age,'25')",
        expectedResults: { "<": ["#age", 25] },
      },
      {
        title:
          'the "lessThan" ibm operator should map to the "<" sql operator for date values',
        querystring: "filter=lessThan(born,'2020-01-01')",
        expectedResults: { "<": ["#born", "2020-01-01"] },
      },
      {
        title:
          'the "lessThan" ibm operator should map to the "<" sql operator for attribute references',
        querystring: "filter=lessThan(wins,losses)",
        expectedResults: { "<": ["#wins", "#losses"] },
      },
      {
        title: 'the "lessThan" ibm operator should not allow null values',
        querystring: "filter=lessThan(age,null)",
        expectedErrors: [
          new QuerystringParsingError({
            message: '"lessThan" operator should not be used with NULL value',
            querystring: "filter=lessThan(age,null)",
            paramKey: "filter",
            paramValue: "lessThan(age,null)",
          }),
        ],
      },
    ]);
  });

  describe("lessOrEqual ibm operator", () => {
    testEachCase([
      {
        title:
          'the "lessOrEqual" ibm operator should map to the "<=" sql operator for string values',
        querystring: "filter=lessOrEqual(name,'michael')",
        expectedResults: { "<=": ["#name", "michael"] },
      },
      {
        title:
          'the "lessOrEqual" ibm operator should map to the "<=" sql operator for number values',
        querystring: "filter=lessOrEqual(age,'25')",
        expectedResults: { "<=": ["#age", 25] },
      },
      {
        title:
          'the "lessOrEqual" ibm operator should map to the "<=" sql operator for date values',
        querystring: "filter=lessOrEqual(born,'2020-01-01')",
        expectedResults: { "<=": ["#born", "2020-01-01"] },
      },
      {
        title:
          'the "lessOrEqual" ibm operator should map to the "<=" sql operator for attribute references',
        querystring: "filter=lessOrEqual(wins,losses)",
        expectedResults: { "<=": ["#wins", "#losses"] },
      },
      {
        title: 'the "lessOrEqual" ibm operator should not allow null values',
        querystring: "filter=lessOrEqual(age,null)",
        expectedErrors: [
          new QuerystringParsingError({
            message:
              '"lessOrEqual" operator should not be used with NULL value',
            querystring: "filter=lessOrEqual(age,null)",
            paramKey: "filter",
            paramValue: "lessOrEqual(age,null)",
          }),
        ],
      },
    ]);
  });

  describe("contains ibm operator", () => {
    testEachCase([
      {
        title:
          'the "contains" ibm operator should map to the "LIKE" sql operator for string values',
        querystring: "filter=contains(name,'ch')",
        expectedResults: { LIKE: ["#name", "%ch%"] },
      },
      {
        title: 'the "contains" ibm operator should not allow number values',
        querystring: "filter=contains(age,'25')",
        expectedErrors: [
          new QuerystringParsingError({
            message: '"contains" operator should not be used with NUMBER value',
            querystring: "filter=contains(age,'25')",
            paramKey: "filter",
            paramValue: "contains(age,'25')",
          }),
        ],
      },
      {
        title: 'the "contains" ibm operator should not allow date values',
        querystring: "filter=contains(born,'2020-01-01')",
        expectedErrors: [
          new QuerystringParsingError({
            message: '"contains" operator should not be used with DATE value',
            querystring: "filter=contains(born,'2020-01-01')",
            paramKey: "filter",
            paramValue: "contains(born,'2020-01-01')",
          }),
        ],
      },
      {
        title:
          'the "contains" ibm operator should not allow attribute references',
        querystring: "filter=contains(wins,losses)",
        expectedErrors: [
          new QuerystringParsingError({
            message:
              '"contains" operator should not be used with ATTRIBUTE_REF value',
            querystring: "filter=contains(wins,losses)",
            paramKey: "filter",
            paramValue: "contains(wins,losses)",
          }),
        ],
      },
      {
        title: 'the "contains" ibm operator should not allow null values',
        querystring: "filter=contains(age,null)",
        expectedErrors: [
          new QuerystringParsingError({
            message: '"contains" operator should not be used with NULL value',
            querystring: "filter=contains(age,null)",
            paramKey: "filter",
            paramValue: "contains(age,null)",
          }),
        ],
      },
    ]);
  });

  describe("startsWith ibm operator", () => {
    testEachCase([
      {
        title:
          'the "startsWith" ibm operator should map to the "LIKE" sql operator for string values',
        querystring: "filter=startsWith(name,'mi')",
        expectedResults: { LIKE: ["#name", "mi%"] },
      },
      {
        title: 'the "startsWith" ibm operator should not allow number values',
        querystring: "filter=startsWith(age,'25')",
        expectedErrors: [
          new QuerystringParsingError({
            message:
              '"startsWith" operator should not be used with NUMBER value',
            querystring: "filter=startsWith(age,'25')",
            paramKey: "filter",
            paramValue: "startsWith(age,'25')",
          }),
        ],
      },
      {
        title: 'the "startsWith" ibm operator should not allow date values',
        querystring: "filter=startsWith(born,'2020-01-01')",
        expectedErrors: [
          new QuerystringParsingError({
            message: '"startsWith" operator should not be used with DATE value',
            querystring: "filter=startsWith(born,'2020-01-01')",
            paramKey: "filter",
            paramValue: "startsWith(born,'2020-01-01')",
          }),
        ],
      },
      {
        title:
          'the "startsWith" ibm operator should not allow attribute references',
        querystring: "filter=startsWith(wins,losses)",
        expectedErrors: [
          new QuerystringParsingError({
            message:
              '"startsWith" operator should not be used with ATTRIBUTE_REF value',
            querystring: "filter=startsWith(wins,losses)",
            paramKey: "filter",
            paramValue: "startsWith(wins,losses)",
          }),
        ],
      },
      {
        title: 'the "startsWith" ibm operator should not allow null values',
        querystring: "filter=startsWith(age,null)",
        expectedErrors: [
          new QuerystringParsingError({
            message: '"startsWith" operator should not be used with NULL value',
            querystring: "filter=startsWith(age,null)",
            paramKey: "filter",
            paramValue: "startsWith(age,null)",
          }),
        ],
      },
    ]);
  });

  describe("endsWith ibm operator", () => {
    testEachCase([
      {
        title:
          'the "endsWith" ibm operator should map to the "LIKE" sql operator for string values',
        querystring: "filter=endsWith(name,'el')",
        expectedResults: { LIKE: ["#name", "%el"] },
      },
      {
        title: 'the "endsWith" ibm operator should not allow number values',
        querystring: "filter=endsWith(age,'25')",
        expectedErrors: [
          new QuerystringParsingError({
            message: '"endsWith" operator should not be used with NUMBER value',
            querystring: "filter=endsWith(age,'25')",
            paramKey: "filter",
            paramValue: "endsWith(age,'25')",
          }),
        ],
      },
      {
        title: 'the "endsWith" ibm operator should not allow date values',
        querystring: "filter=endsWith(born,'2020-01-01')",
        expectedErrors: [
          new QuerystringParsingError({
            message: '"endsWith" operator should not be used with DATE value',
            querystring: "filter=endsWith(born,'2020-01-01')",
            paramKey: "filter",
            paramValue: "endsWith(born,'2020-01-01')",
          }),
        ],
      },
      {
        title:
          'the "endsWith" ibm operator should not allow attribute references',
        querystring: "filter=endsWith(wins,losses)",
        expectedErrors: [
          new QuerystringParsingError({
            message:
              '"endsWith" operator should not be used with ATTRIBUTE_REF value',
            querystring: "filter=endsWith(wins,losses)",
            paramKey: "filter",
            paramValue: "endsWith(wins,losses)",
          }),
        ],
      },
      {
        title: 'the "endsWith" ibm operator should not allow null values',
        querystring: "filter=endsWith(age,null)",
        expectedErrors: [
          new QuerystringParsingError({
            message: '"endsWith" operator should not be used with NULL value',
            querystring: "filter=endsWith(age,null)",
            paramKey: "filter",
            paramValue: "endsWith(age,null)",
          }),
        ],
      },
    ]);
  });

  describe("any ibm operator", () => {
    testEachCase([
      {
        title:
          'the "any" ibm operator should map to the "IN" sql operator for string values (also null)',
        querystring: "filter=any(name,'michael','brad',null)",
        expectedResults: { IN: ["#name", "michael", "brad", null] },
      },
      {
        title:
          'the "any" ibm operator should map to the "IN" sql operator for number values (also null)',
        querystring: "filter=any(age,'24','25',null)",
        expectedResults: { IN: ["#age", 24, 25, null] },
      },
      {
        title:
          'the "any" ibm operator should map to the "IN" sql operator for date values (also null)',
        querystring: "filter=any(born,'2020-01-01','2021-01-01',null)",
        expectedResults: { IN: ["#born", "2020-01-01", "2021-01-01", null] },
      },
      {
        title: 'the "any" ibm operator should not allow attribute references',
        querystring: "filter=any(wins,losses,age)",
        expectedErrors: [
          new QuerystringParsingError({
            message:
              '"any" operator should not be used with ATTRIBUTE_REF value',
            querystring: "filter=any(wins,losses,age)",
            paramKey: "filter",
            paramValue: "any(wins,losses,age)",
          }),
        ],
      },
      {
        title:
          'the "any" ibm operator should not allow multiple value types (string and number)',
        querystring: "filter=any(name,'brad','25')",
        expectedErrors: [
          new QuerystringParsingError({
            message:
              '"any" operator should not be used with multiple value types',
            querystring: "filter=any(name,'brad','25')",
            paramKey: "filter",
            paramValue: "any(name,'brad','25')",
          }),
        ],
      },
      {
        title:
          'the "any" ibm operator should not allow multiple value types (string and date)',
        querystring: "filter=any(name,'brad','2020-01-01')",
        expectedErrors: [
          new QuerystringParsingError({
            message:
              '"any" operator should not be used with multiple value types',
            querystring: "filter=any(name,'brad','2020-01-01')",
            paramKey: "filter",
            paramValue: "any(name,'brad','2020-01-01')",
          }),
        ],
      },
    ]);
  });

  /**
   * Higher Order Operators
   */

  describe("not ibm operator", () => {
    testEachCase([
      {
        title:
          'the "not" ibm operator should map to the "NOT" sql operator for "equals" sub-expressions',
        querystring: "filter=not(equals(age,'25'))",
        expectedResults: { NOT: { "=": ["#age", 25] } },
      },
      {
        title:
          'the "not" ibm operator should map to the "NOT" sql operator for "greaterThan" sub-expressions',
        querystring: "filter=not(greaterThan(age,'25'))",
        expectedResults: { NOT: { ">": ["#age", 25] } },
      },
      {
        title:
          'the "not" ibm operator should map to the "NOT" sql operator for "greaterOrEqual" sub-expressions',
        querystring: "filter=not(greaterOrEqual(age,'25'))",
        expectedResults: { NOT: { ">=": ["#age", 25] } },
      },
      {
        title:
          'the "not" ibm operator should map to the "NOT" sql operator for "lessThan" sub-expressions',
        querystring: "filter=not(lessThan(age,'25'))",
        expectedResults: { NOT: { "<": ["#age", 25] } },
      },
      {
        title:
          'the "not" ibm operator should map to the "NOT" sql operator for "lessOrEqual" sub-expressions',
        querystring: "filter=not(lessOrEqual(age,'25'))",
        expectedResults: { NOT: { "<=": ["#age", 25] } },
      },
      {
        title:
          'the "not" ibm operator should map to the "NOT" sql operator for "contains" sub-expressions',
        querystring: "filter=not(contains(name,'ch'))",
        expectedResults: { NOT: { LIKE: ["#name", "%ch%"] } },
      },
      {
        title:
          'the "not" ibm operator should map to the "NOT" sql operator for "startsWith" sub-expressions',
        querystring: "filter=not(startsWith(name,'mi'))",
        expectedResults: { NOT: { LIKE: ["#name", "mi%"] } },
      },
      {
        title:
          'the "not" ibm operator should map to the "NOT" sql operator for "endsWith" sub-expressions',
        querystring: "filter=not(endsWith(name,'el'))",
        expectedResults: { NOT: { LIKE: ["#name", "%el"] } },
      },
      {
        title:
          'the "not" ibm operator should map to the "NOT" sql operator for "any" sub-expressions',
        querystring: "filter=not(any(age,'23','24','25'))",
        expectedResults: { NOT: { IN: ["#age", 23, 24, 25] } },
      },
      {
        title:
          'the "not" ibm operator should map to the "NOT" sql operator for "not" sub-expressions',
        querystring: "filter=not(not(equals(age,'25'))",
        expectedResults: { NOT: { NOT: { "=": ["#age", 25] } } },
      },
      {
        title:
          'the "not" ibm operator should map to the "NOT" sql operator for "and" sub-expressions',
        querystring:
          "filter=not(and(lessThan(age,'25'),greaterThan(age,'20')))",
        expectedResults: {
          NOT: { AND: [{ "<": ["#age", 25] }, { ">": ["#age", 20] }] },
        },
      },
      {
        title:
          'the "not" ibm operator should map to the "NOT" sql operator for "or" sub-expressions',
        querystring: "filter=not(or(lessThan(age,'25'),greaterThan(age,'20')))",
        expectedResults: {
          NOT: { OR: [{ "<": ["#age", 25] }, { ">": ["#age", 20] }] },
        },
      },
    ]);
  });

  describe("and ibm operator", () => {
    testEachCase([
      {
        title:
          'the "and" ibm operator should map to the "AND" sql operator for "equals" sub-expressions',
        querystring: "filter=and(equals(age,'25'),equals(name,'michael'))",
        expectedResults: {
          AND: [{ "=": ["#age", 25] }, { "=": ["#name", "michael"] }],
        },
      },
      {
        title:
          'the "and" ibm operator should map to the "AND" sql operator for "greaterThan" sub-expressions',
        querystring: "filter=and(greaterThan(age,'25'),equals(age,'25'))",
        expectedResults: {
          AND: [{ ">": ["#age", 25] }, { "=": ["#age", 25] }],
        },
      },
      {
        title:
          'the "and" ibm operator should map to the "AND" sql operator for "greaterOrEqual" sub-expressions',
        querystring: "filter=and(greaterOrEqual(age,'25'),equals(age,'25'))",
        expectedResults: {
          AND: [{ ">=": ["#age", 25] }, { "=": ["#age", 25] }],
        },
      },
      {
        title:
          'the "and" ibm operator should map to the "AND" sql operator for "lessThan" sub-expressions',
        querystring: "filter=and(lessThan(age,'25'),equals(age,'25'))",
        expectedResults: {
          AND: [{ "<": ["#age", 25] }, { "=": ["#age", 25] }],
        },
      },
      {
        title:
          'the "and" ibm operator should map to the "AND" sql operator for "lessOrEqual" sub-expressions',
        querystring: "filter=and(lessOrEqual(age,'25'),equals(age,'25'))",
        expectedResults: {
          AND: [{ "<=": ["#age", 25] }, { "=": ["#age", 25] }],
        },
      },
      {
        title:
          'the "and" ibm operator should map to the "AND" sql operator for "contains" sub-expressions',
        querystring: "filter=and(contains(name,'ch'),equals(age,'25'))",
        expectedResults: {
          AND: [{ LIKE: ["#name", "%ch%"] }, { "=": ["#age", 25] }],
        },
      },
      {
        title:
          'the "and" ibm operator should map to the "AND" sql operator for "startsWith" sub-expressions',
        querystring: "filter=and(startsWith(name,'mi'),equals(age,'25'))",
        expectedResults: {
          AND: [{ LIKE: ["#name", "mi%"] }, { "=": ["#age", 25] }],
        },
      },
      {
        title:
          'the "and" ibm operator should map to the "AND" sql operator for "endsWith" sub-expressions',
        querystring: "filter=and(endsWith(name,'el'),equals(age,'25'))",
        expectedResults: {
          AND: [{ LIKE: ["#name", "%el"] }, { "=": ["#age", 25] }],
        },
      },
      {
        title:
          'the "and" ibm operator should map to the "AND" sql operator for "any" sub-expressions',
        querystring: "filter=and(any(age,'23','24','25'),equals(age,'25'))",
        expectedResults: {
          AND: [{ IN: ["#age", 23, 24, 25] }, { "=": ["#age", 25] }],
        },
      },
      {
        title:
          'the "and" ibm operator should map to the "AND" sql operator for "not" sub-expressions',
        querystring: "filter=and(not(equals(age,'25'),equals(age,'25'))",
        expectedResults: {
          AND: [{ NOT: { "=": ["#age", 25] } }, { "=": ["#age", 25] }],
        },
      },
      {
        title:
          'the "and" ibm operator should map to the "AND" sql operator for "and" sub-expressions',
        querystring:
          "filter=and(and(lessThan(age,'25'),greaterThan(age,'20')),equals(age,'25'))",
        expectedResults: {
          AND: [
            { AND: [{ "<": ["#age", 25] }, { ">": ["#age", 20] }] },
            { "=": ["#age", 25] },
          ],
        },
      },
      {
        title:
          'the "and" ibm operator should map to the "AND" sql operator for "or" sub-expressions',
        querystring:
          "filter=and(or(lessThan(age,'25'),greaterThan(age,'20')),equals(age,'25'))",
        expectedResults: {
          AND: [
            { OR: [{ "<": ["#age", 25] }, { ">": ["#age", 20] }] },
            { "=": ["#age", 25] },
          ],
        },
      },
    ]);
  });

  describe("or ibm operator", () => {
    testEachCase([
      {
        title:
          'the "or" ibm operator should map to the "OR" sql operator for "equals" sub-expressions',
        querystring: "filter=or(equals(age,'25'),equals(name,'michael'))",
        expectedResults: {
          OR: [{ "=": ["#age", 25] }, { "=": ["#name", "michael"] }],
        },
      },
      {
        title:
          'the "or" ibm operator should map to the "OR" sql operator for "greaterThan" sub-expressions',
        querystring: "filter=or(greaterThan(age,'25'),equals(age,'25'))",
        expectedResults: { OR: [{ ">": ["#age", 25] }, { "=": ["#age", 25] }] },
      },
      {
        title:
          'the "or" ibm operator should map to the "OR" sql operator for "greaterOrEqual" sub-expressions',
        querystring: "filter=or(greaterOrEqual(age,'25'),equals(age,'25'))",
        expectedResults: {
          OR: [{ ">=": ["#age", 25] }, { "=": ["#age", 25] }],
        },
      },
      {
        title:
          'the "or" ibm operator should map to the "OR" sql operator for "lessThan" sub-expressions',
        querystring: "filter=or(lessThan(age,'25'),equals(age,'25'))",
        expectedResults: { OR: [{ "<": ["#age", 25] }, { "=": ["#age", 25] }] },
      },
      {
        title:
          'the "or" ibm operator should map to the "OR" sql operator for "lessOrEqual" sub-expressions',
        querystring: "filter=or(lessOrEqual(age,'25'),equals(age,'25'))",
        expectedResults: {
          OR: [{ "<=": ["#age", 25] }, { "=": ["#age", 25] }],
        },
      },
      {
        title:
          'the "or" ibm operator should map to the "OR" sql operator for "contains" sub-expressions',
        querystring: "filter=or(contains(name,'ch'),equals(age,'25'))",
        expectedResults: {
          OR: [{ LIKE: ["#name", "%ch%"] }, { "=": ["#age", 25] }],
        },
      },
      {
        title:
          'the "or" ibm operator should map to the "OR" sql operator for "startsWith" sub-expressions',
        querystring: "filter=or(startsWith(name,'mi'),equals(age,'25'))",
        expectedResults: {
          OR: [{ LIKE: ["#name", "mi%"] }, { "=": ["#age", 25] }],
        },
      },
      {
        title:
          'the "or" ibm operator should map to the "OR" sql operator for "endsWith" sub-expressions',
        querystring: "filter=or(endsWith(name,'el'),equals(age,'25'))",
        expectedResults: {
          OR: [{ LIKE: ["#name", "%el"] }, { "=": ["#age", 25] }],
        },
      },
      {
        title:
          'the "or" ibm operator should map to the "OR" sql operator for "any" sub-expressions',
        querystring: "filter=or(any(age,'23','24','25'),equals(age,'25'))",
        expectedResults: {
          OR: [{ IN: ["#age", 23, 24, 25] }, { "=": ["#age", 25] }],
        },
      },
      {
        title:
          'the "or" ibm operator should map to the "OR" sql operator for "not" sub-expressions',
        querystring: "filter=or(not(equals(age,'25'),equals(age,'25'))",
        expectedResults: {
          OR: [{ NOT: { "=": ["#age", 25] } }, { "=": ["#age", 25] }],
        },
      },
      {
        title:
          'the "or" ibm operator should map to the "OR" sql operator for "and" sub-expressions',
        querystring:
          "filter=or(and(lessThan(age,'25'),greaterThan(age,'20')),equals(age,'25'))",
        expectedResults: {
          OR: [
            { AND: [{ "<": ["#age", 25] }, { ">": ["#age", 20] }] },
            { "=": ["#age", 25] },
          ],
        },
      },
      {
        title:
          'the "or" ibm operator should map to the "OR" sql operator for "or" sub-expressions',
        querystring:
          "filter=or(or(lessThan(age,'25'),greaterThan(age,'20')),equals(age,'25'))",
        expectedResults: {
          OR: [
            { OR: [{ "<": ["#age", 25] }, { ">": ["#age", 20] }] },
            { "=": ["#age", 25] },
          ],
        },
      },
    ]);
  });

  describe("multiple filters", () => {
    testEachCase([
      {
        title:
          "multiple filters should be join together in an OR fashion (ex: 2)",
        querystring: "filter=equals(name,'michael')&filter=equals(age,'25')",
        expectedResults: {
          OR: [{ "=": ["#name", "michael"] }, { "=": ["#age", 25] }],
        },
      },
      {
        title:
          "multiple filters should be join together in an OR fashion (ex: 3)",
        querystring:
          "filter=equals(name,'michael')&filter=equals(age,'25')&filter=lessThan(born,'2020-01-01')",
        expectedResults: {
          OR: [
            { OR: [{ "=": ["#name", "michael"] }, { "=": ["#age", 25] }] },
            { "<": ["#born", "2020-01-01"] },
          ],
        },
      },
    ]);
  });
});
