const { parseIbmFilter } = require('../../lib/filter-styles/parse-ibm-filter')

function testEachCase(testCases) {
  test.concurrent.each(testCases)('$title', ({ queryString, expectedResults, expectedErrors }) => {
    const { results, errors } = parseIbmFilter(queryString)
    expect(results).toEqual(expectedResults || undefined)
    expect(errors).toEqual(expectedErrors || [])
  })
}

describe('parseIbmFilter() tests', () => {
  describe('equals ibm operator', () => {
    testEachCase([
      {
        title: 'the "equals" ibm operator should map to the "=" sql operator for string values',
        queryString: "filter=equals(name,'michael')",
        expectedResults: { '=': ['#name', 'michael'] }
      },
      {
        title: 'the "equals" ibm operator should map to the "=" sql operator for number values',
        queryString: "filter=equals(age,'25')",
        expectedResults: { '=': ['#age', 25] }
      },
      {
        title: 'the "equals" ibm operator should map to the "=" sql operator for date values',
        queryString: "filter=equals(born,'2020-01-01')",
        expectedResults: { '=': ['#born', '2020-01-01'] }
      },
      {
        title: 'the "equals" ibm operator should map to the "=" sql operator for attribute references',
        queryString: "filter=equals(wins,losses)",
        expectedResults: { '=': ['#wins', '#losses'] }
      },
      {
        title: 'the "equals" ibm operator should map to the "IS NULL" sql operator for null values',
        queryString: "filter=equals(age,null)",
        expectedResults: { 'IS NULL': '#age' }
      },
    ])
  })

  describe('greaterThan ibm operator', () => {
    testEachCase([
      {
        title: 'the "greaterThan" ibm operator should map to the ">" sql operator for string values',
        queryString: "filter=greaterThan(name,'michael')",
        expectedResults: { '>': ['#name', 'michael'] }
      },
      {
        title: 'the "greaterThan" ibm operator should map to the ">" sql operator for number values',
        queryString: "filter=greaterThan(age,'25')",
        expectedResults: { '>': ['#age', 25] }
      },
      {
        title: 'the "greaterThan" ibm operator should map to the ">" sql operator for date values',
        queryString: "filter=greaterThan(born,'2020-01-01')",
        expectedResults: { '>': ['#born', '2020-01-01'] }
      },
      {
        title: 'the "greaterThan" ibm operator should map to the ">" sql operator for attribute references',
        queryString: "filter=greaterThan(wins,losses)",
        expectedResults: { '>': ['#wins', '#losses'] }
      },
      {
        title: 'the "greaterThan" ibm operator should not allow null values',
        queryString: "filter=greaterThan(age,null)",
        expectedErrors: [new Error('"greaterThan" operator should not be used with NULL value')]
      },
    ])
  })

  describe('greaterOrEqual ibm operator', () => {
    testEachCase([
      {
        title: 'the "greaterOrEqual" ibm operator should map to the ">=" sql operator for string values',
        queryString: "filter=greaterOrEqual(name,'michael')",
        expectedResults: { '>=': ['#name', 'michael'] }
      },
      {
        title: 'the "greaterOrEqual" ibm operator should map to the ">=" sql operator for number values',
        queryString: "filter=greaterOrEqual(age,'25')",
        expectedResults: { '>=': ['#age', 25] }
      },
      {
        title: 'the "greaterOrEqual" ibm operator should map to the ">=" sql operator for date values',
        queryString: "filter=greaterOrEqual(born,'2020-01-01')",
        expectedResults: { '>=': ['#born', '2020-01-01'] }
      },
      {
        title: 'the "greaterOrEqual" ibm operator should map to the ">=" sql operator for attribute references',
        queryString: "filter=greaterOrEqual(wins,losses)",
        expectedResults: { '>=': ['#wins', '#losses'] }
      },
      {
        title: 'the "greaterOrEqual" ibm operator should not allow null values',
        queryString: "filter=greaterOrEqual(age,null)",
        expectedErrors: [new Error('"greaterOrEqual" operator should not be used with NULL value')]
      },
    ])
  })

  describe('lessThan ibm operator', () => {
    testEachCase([
      {
        title: 'the "lessThan" ibm operator should map to the "<" sql operator for string values',
        queryString: "filter=lessThan(name,'michael')",
        expectedResults: { '<': ['#name', 'michael'] }
      },
      {
        title: 'the "lessThan" ibm operator should map to the "<" sql operator for number values',
        queryString: "filter=lessThan(age,'25')",
        expectedResults: { '<': ['#age', 25] }
      },
      {
        title: 'the "lessThan" ibm operator should map to the "<" sql operator for date values',
        queryString: "filter=lessThan(born,'2020-01-01')",
        expectedResults: { '<': ['#born', '2020-01-01'] }
      },
      {
        title: 'the "lessThan" ibm operator should map to the "<" sql operator for attribute references',
        queryString: "filter=lessThan(wins,losses)",
        expectedResults: { '<': ['#wins', '#losses'] }
      },
      {
        title: 'the "lessThan" ibm operator should not allow null values',
        queryString: "filter=lessThan(age,null)",
        expectedErrors: [new Error('"lessThan" operator should not be used with NULL value')]
      },
    ])
  })

  describe('lessOrEqual ibm operator', () => {
    testEachCase([
      {
        title: 'the "lessOrEqual" ibm operator should map to the "<=" sql operator for string values',
        queryString: "filter=lessOrEqual(name,'michael')",
        expectedResults: { '<=': ['#name', 'michael'] }
      },
      {
        title: 'the "lessOrEqual" ibm operator should map to the "<=" sql operator for number values',
        queryString: "filter=lessOrEqual(age,'25')",
        expectedResults: { '<=': ['#age', 25] }
      },
      {
        title: 'the "lessOrEqual" ibm operator should map to the "<=" sql operator for date values',
        queryString: "filter=lessOrEqual(born,'2020-01-01')",
        expectedResults: { '<=': ['#born', '2020-01-01'] }
      },
      {
        title: 'the "lessOrEqual" ibm operator should map to the "<=" sql operator for attribute references',
        queryString: "filter=lessOrEqual(wins,losses)",
        expectedResults: { '<=': ['#wins', '#losses'] }
      },
      {
        title: 'the "lessOrEqual" ibm operator should not allow null values',
        queryString: "filter=lessOrEqual(age,null)",
        expectedErrors: [new Error('"lessOrEqual" operator should not be used with NULL value')]
      },
    ])
  })

  describe('contains ibm operator', () => {
    testEachCase([
      {
        title: 'the "contains" ibm operator should map to the "LIKE" sql operator for string values',
        queryString: "filter=contains(name,'ch')",
        expectedResults: { 'LIKE': ['#name', '%ch%'] }
      },
      {
        title: 'the "contains" ibm operator should not allow number values',
        queryString: "filter=contains(age,'25')",
        expectedErrors: [new Error('"contains" operator should not be used with NUMBER value')]
      },
      {
        title: 'the "contains" ibm operator should not allow date values',
        queryString: "filter=contains(born,'2020-01-01')",
        expectedErrors: [new Error('"contains" operator should not be used with DATE value')]
      },
      {
        title: 'the "contains" ibm operator should not allow attribute references',
        queryString: "filter=contains(wins,losses)",
        expectedErrors: [new Error('"contains" operator should not be used with ATTRIBUTE_REF value')]
      },
      {
        title: 'the "contains" ibm operator should not allow null values',
        queryString: "filter=contains(age,null)",
        expectedErrors: [new Error('"contains" operator should not be used with NULL value')]
      },
    ])
  })

  describe('startsWith ibm operator', () => {
    testEachCase([
      {
        title: 'the "startsWith" ibm operator should map to the "LIKE" sql operator for string values',
        queryString: "filter=startsWith(name,'mi')",
        expectedResults: { 'LIKE': ['#name', 'mi%'] }
      },
      {
        title: 'the "startsWith" ibm operator should not allow number values',
        queryString: "filter=startsWith(age,'25')",
        expectedErrors: [new Error('"startsWith" operator should not be used with NUMBER value')]
      },
      {
        title: 'the "startsWith" ibm operator should not allow date values',
        queryString: "filter=startsWith(born,'2020-01-01')",
        expectedErrors: [new Error('"startsWith" operator should not be used with DATE value')]
      },
      {
        title: 'the "startsWith" ibm operator should not allow attribute references',
        queryString: "filter=startsWith(wins,losses)",
        expectedErrors: [new Error('"startsWith" operator should not be used with ATTRIBUTE_REF value')]
      },
      {
        title: 'the "startsWith" ibm operator should not allow null values',
        queryString: "filter=startsWith(age,null)",
        expectedErrors: [new Error('"startsWith" operator should not be used with NULL value')]
      },
    ])
  })

  describe('endsWith ibm operator', () => {
    testEachCase([
      {
        title: 'the "endsWith" ibm operator should map to the "LIKE" sql operator for string values',
        queryString: "filter=endsWith(name,'el')",
        expectedResults: { 'LIKE': ['#name', '%el'] }
      },
      {
        title: 'the "endsWith" ibm operator should not allow number values',
        queryString: "filter=endsWith(age,'25')",
        expectedErrors: [new Error('"endsWith" operator should not be used with NUMBER value')]
      },
      {
        title: 'the "endsWith" ibm operator should not allow date values',
        queryString: "filter=endsWith(born,'2020-01-01')",
        expectedErrors: [new Error('"endsWith" operator should not be used with DATE value')]
      },
      {
        title: 'the "endsWith" ibm operator should not allow attribute references',
        queryString: "filter=endsWith(wins,losses)",
        expectedErrors: [new Error('"endsWith" operator should not be used with ATTRIBUTE_REF value')]
      },
      {
        title: 'the "endsWith" ibm operator should not allow null values',
        queryString: "filter=endsWith(age,null)",
        expectedErrors: [new Error('"endsWith" operator should not be used with NULL value')]
      },
    ])
  })

  describe('any ibm operator', () => {
    testEachCase([
      {
        title: 'the "any" ibm operator should map to the "IN" sql operator for string values (also null)',
        queryString: "filter=any(name,'michael','brad',null)",
        expectedResults: { 'IN': ['#name', 'michael', 'brad', null] }
      },
      {
        title: 'the "any" ibm operator should map to the "IN" sql operator for number values (also null)',
        queryString: "filter=any(age,'24','25',null)",
        expectedResults: { 'IN': ['#age', 24, 25, null] }
      },
      {
        title: 'the "any" ibm operator should map to the "IN" sql operator for date values (also null)',
        queryString: "filter=any(born,'2020-01-01','2021-01-01',null)",
        expectedResults: { 'IN': ['#born', '2020-01-01', '2021-01-01', null] }
      },
      {
        title: 'the "any" ibm operator should not allow attribute references',
        queryString: "filter=any(wins,losses,age)",
        expectedErrors: [new Error('"any" operator should not be used with ATTRIBUTE_REF value')]
      },
    ])
  })

  /**
   * Higher Order Operators
   */

  describe('not ibm operator', () => {
    testEachCase([
      {
        title: 'the "not" ibm operator should map to the "NOT" sql operator for "equals" sub-expressions',
        queryString: "filter=not(equals(age,'25'))",
        expectedResults: {'NOT': { '=': ['#age', 25] } }
      },
      {
        title: 'the "not" ibm operator should map to the "NOT" sql operator for "greaterThan" sub-expressions',
        queryString: "filter=not(greaterThan(age,'25'))",
        expectedResults: {'NOT': { '>': ['#age', 25] } }
      },
      {
        title: 'the "not" ibm operator should map to the "NOT" sql operator for "greaterOrEqual" sub-expressions',
        queryString: "filter=not(greaterOrEqual(age,'25'))",
        expectedResults: {'NOT': { '>=': ['#age', 25] } }
      },
      {
        title: 'the "not" ibm operator should map to the "NOT" sql operator for "lessThan" sub-expressions',
        queryString: "filter=not(lessThan(age,'25'))",
        expectedResults: {'NOT': { '<': ['#age', 25] } }
      },
      {
        title: 'the "not" ibm operator should map to the "NOT" sql operator for "lessOrEqual" sub-expressions',
        queryString: "filter=not(lessOrEqual(age,'25'))",
        expectedResults: {'NOT': { '<=': ['#age', 25] } }
      },
      {
        title: 'the "not" ibm operator should map to the "NOT" sql operator for "contains" sub-expressions',
        queryString: "filter=not(contains(name,'ch'))",
        expectedResults: {'NOT': { 'LIKE': ['#name', '%ch%'] } }
      },
      {
        title: 'the "not" ibm operator should map to the "NOT" sql operator for "startsWith" sub-expressions',
        queryString: "filter=not(startsWith(name,'mi'))",
        expectedResults: {'NOT': { 'LIKE': ['#name', 'mi%'] } }
      },
      {
        title: 'the "not" ibm operator should map to the "NOT" sql operator for "endsWith" sub-expressions',
        queryString: "filter=not(endsWith(name,'el'))",
        expectedResults: {'NOT': { 'LIKE': ['#name', '%el'] } }
      },
      {
        title: 'the "not" ibm operator should map to the "NOT" sql operator for "any" sub-expressions',
        queryString: "filter=not(any(age,'23','24','25'))",
        expectedResults: {'NOT': { 'IN': ['#age', 23, 24, 25] } }
      },
      {
        title: 'the "not" ibm operator should map to the "NOT" sql operator for "not" sub-expressions',
        queryString: "filter=not(not(equals(age,'25'))",
        expectedResults: {'NOT': {'NOT': { '=': ['#age', 25] } } }
      },
      {
        title: 'the "not" ibm operator should map to the "NOT" sql operator for "and" sub-expressions',
        queryString: "filter=not(and(lessThan(age,'25'),greaterThan(age,'20')))",
        expectedResults: {'NOT': {'AND': [{'<': ['#age', 25]},{'>': ['#age', 20]}]} }
      },
      {
        title: 'the "not" ibm operator should map to the "NOT" sql operator for "or" sub-expressions',
        queryString: "filter=not(or(lessThan(age,'25'),greaterThan(age,'20')))",
        expectedResults: {'NOT': {'OR': [{'<': ['#age', 25]},{'>': ['#age', 20]}]} }
      },
    ])
  })

  describe('and ibm operator', () => {
    testEachCase([
      {
        title: 'the "and" ibm operator should map to the "AND" sql operator for "equals" sub-expressions',
        queryString: "filter=and(equals(age,'25'),equals(name,'michael'))",
        expectedResults: {'AND': [{ '=': ['#age', 25] }, { '=': ['#name', 'michael'] }] }
      },
      {
        title: 'the "and" ibm operator should map to the "AND" sql operator for "greaterThan" sub-expressions',
        queryString: "filter=and(greaterThan(age,'25'),equals(age,'25'))",
        expectedResults: {'AND': [{ '>': ['#age', 25] },{ '=': ['#age', 25] } ] }
      },
      {
        title: 'the "and" ibm operator should map to the "AND" sql operator for "greaterOrEqual" sub-expressions',
        queryString: "filter=and(greaterOrEqual(age,'25'),equals(age,'25'))",
        expectedResults: {'AND': [{ '>=': ['#age', 25] }, { '=': ['#age', 25] }] }
      },
      {
        title: 'the "and" ibm operator should map to the "AND" sql operator for "lessThan" sub-expressions',
        queryString: "filter=and(lessThan(age,'25'),equals(age,'25'))",
        expectedResults: {'AND': [{ '<': ['#age', 25] }, { '=': ['#age', 25] }] }
      },
      {
        title: 'the "and" ibm operator should map to the "AND" sql operator for "lessOrEqual" sub-expressions',
        queryString: "filter=and(lessOrEqual(age,'25'),equals(age,'25'))",
        expectedResults: {'AND': [{ '<=': ['#age', 25] }, { '=': ['#age', 25] }] }
      },
      {
        title: 'the "and" ibm operator should map to the "AND" sql operator for "contains" sub-expressions',
        queryString: "filter=and(contains(name,'ch'),equals(age,'25'))",
        expectedResults: {'AND': [{ 'LIKE': ['#name', '%ch%'] }, { '=': ['#age', 25] }] }
      },
      {
        title: 'the "and" ibm operator should map to the "AND" sql operator for "startsWith" sub-expressions',
        queryString: "filter=and(startsWith(name,'mi'),equals(age,'25'))",
        expectedResults: {'AND': [{ 'LIKE': ['#name', 'mi%'] }, { '=': ['#age', 25] }] }
      },
      {
        title: 'the "and" ibm operator should map to the "AND" sql operator for "endsWith" sub-expressions',
        queryString: "filter=and(endsWith(name,'el'),equals(age,'25'))",
        expectedResults: {'AND': [{ 'LIKE': ['#name', '%el'] }, { '=': ['#age', 25] }] }
      },
      {
        title: 'the "and" ibm operator should map to the "AND" sql operator for "any" sub-expressions',
        queryString: "filter=and(any(age,'23','24','25'),equals(age,'25'))",
        expectedResults: {'AND': [{ 'IN': ['#age', 23, 24, 25] }, { '=': ['#age', 25] }] }
      },
      {
        title: 'the "and" ibm operator should map to the "AND" sql operator for "not" sub-expressions',
        queryString: "filter=and(not(equals(age,'25'),equals(age,'25'))",
        expectedResults: {'AND': [{'NOT': { '=': ['#age', 25] } }, { '=': ['#age', 25] }] }
      },
      {
        title: 'the "and" ibm operator should map to the "AND" sql operator for "and" sub-expressions',
        queryString: "filter=and(and(lessThan(age,'25'),greaterThan(age,'20')),equals(age,'25'))",
        expectedResults: {'AND': [{'AND': [{'<': ['#age', 25]},{'>': ['#age', 20]}]}, { '=': ['#age', 25] }] }
      },
      {
        title: 'the "and" ibm operator should map to the "AND" sql operator for "or" sub-expressions',
        queryString: "filter=and(or(lessThan(age,'25'),greaterThan(age,'20')),equals(age,'25'))",
        expectedResults: {'AND': [{'OR': [{'<': ['#age', 25]},{'>': ['#age', 20]}]}, { '=': ['#age', 25] }] }
      },
    ])
  })

  describe('or ibm operator', () => {
    testEachCase([
      {
        title: 'the "or" ibm operator should map to the "OR" sql operator for "equals" sub-expressions',
        queryString: "filter=or(equals(age,'25'),equals(name,'michael'))",
        expectedResults: {'OR': [{ '=': ['#age', 25] }, { '=': ['#name', 'michael'] }] }
      },
      {
        title: 'the "or" ibm operator should map to the "OR" sql operator for "greaterThan" sub-expressions',
        queryString: "filter=or(greaterThan(age,'25'),equals(age,'25'))",
        expectedResults: {'OR': [{ '>': ['#age', 25] },{ '=': ['#age', 25] } ] }
      },
      {
        title: 'the "or" ibm operator should map to the "OR" sql operator for "greaterOrEqual" sub-expressions',
        queryString: "filter=or(greaterOrEqual(age,'25'),equals(age,'25'))",
        expectedResults: {'OR': [{ '>=': ['#age', 25] }, { '=': ['#age', 25] }] }
      },
      {
        title: 'the "or" ibm operator should map to the "OR" sql operator for "lessThan" sub-expressions',
        queryString: "filter=or(lessThan(age,'25'),equals(age,'25'))",
        expectedResults: {'OR': [{ '<': ['#age', 25] }, { '=': ['#age', 25] }] }
      },
      {
        title: 'the "or" ibm operator should map to the "OR" sql operator for "lessOrEqual" sub-expressions',
        queryString: "filter=or(lessOrEqual(age,'25'),equals(age,'25'))",
        expectedResults: {'OR': [{ '<=': ['#age', 25] }, { '=': ['#age', 25] }] }
      },
      {
        title: 'the "or" ibm operator should map to the "OR" sql operator for "contains" sub-expressions',
        queryString: "filter=or(contains(name,'ch'),equals(age,'25'))",
        expectedResults: {'OR': [{ 'LIKE': ['#name', '%ch%'] }, { '=': ['#age', 25] }] }
      },
      {
        title: 'the "or" ibm operator should map to the "OR" sql operator for "startsWith" sub-expressions',
        queryString: "filter=or(startsWith(name,'mi'),equals(age,'25'))",
        expectedResults: {'OR': [{ 'LIKE': ['#name', 'mi%'] }, { '=': ['#age', 25] }] }
      },
      {
        title: 'the "or" ibm operator should map to the "OR" sql operator for "endsWith" sub-expressions',
        queryString: "filter=or(endsWith(name,'el'),equals(age,'25'))",
        expectedResults: {'OR': [{ 'LIKE': ['#name', '%el'] }, { '=': ['#age', 25] }] }
      },
      {
        title: 'the "or" ibm operator should map to the "OR" sql operator for "any" sub-expressions',
        queryString: "filter=or(any(age,'23','24','25'),equals(age,'25'))",
        expectedResults: {'OR': [{ 'IN': ['#age', 23, 24, 25] }, { '=': ['#age', 25] }] }
      },
      {
        title: 'the "or" ibm operator should map to the "OR" sql operator for "not" sub-expressions',
        queryString: "filter=or(not(equals(age,'25'),equals(age,'25'))",
        expectedResults: {'OR': [{'NOT': { '=': ['#age', 25] } }, { '=': ['#age', 25] }] }
      },
      {
        title: 'the "or" ibm operator should map to the "OR" sql operator for "and" sub-expressions',
        queryString: "filter=or(and(lessThan(age,'25'),greaterThan(age,'20')),equals(age,'25'))",
        expectedResults: {'OR': [{'AND': [{'<': ['#age', 25]},{'>': ['#age', 20]}]}, { '=': ['#age', 25] }] }
      },
      {
        title: 'the "or" ibm operator should map to the "OR" sql operator for "or" sub-expressions',
        queryString: "filter=or(or(lessThan(age,'25'),greaterThan(age,'20')),equals(age,'25'))",
        expectedResults: {'OR': [{'OR': [{'<': ['#age', 25]},{'>': ['#age', 20]}]}, { '=': ['#age', 25] }] }
      },
    ])
  })

  describe('multiple filters', () => {
    testEachCase([
      {
        title: 'multiple filters should be join together in an OR fashion (ex: 2)',
        queryString: "filter=equals(name,'michael')&filter=equals(age,'25')",
        expectedResults: { 'OR': [{ '=': ['#name', 'michael'] }, { '=': ['#age', 25] }]}
      },
      {
        title: 'multiple filters should be join together in an OR fashion (ex: 3)',
        queryString: "filter=equals(name,'michael')&filter=equals(age,'25')&filter=lessThan(born,'2020-01-01')",
        expectedResults: {'OR': [{ 'OR': [{ '=': ['#name', 'michael'] }, { '=': ['#age', 25] }]}, { '<': ['#born', '2020-01-01']}]}
      },
    ])
  })
})