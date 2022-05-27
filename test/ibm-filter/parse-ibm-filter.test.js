const { parseIbmFilter, parseExpressionRec, tokenizeExpression } = require('../../lib/ibm-filter/parse-ibm-filter')
const util = require('util')

function testEachCase(testCases) {
  test.concurrent.each(testCases)('$title', ({ queryString, expectedResults, expectedErrors }) => {
    const { results, errors } = parseIbmFilter(queryString)
    expect(results).toEqual(expectedResults || undefined)
    expect(errors).toEqual(expectedErrors || [])
  })
}

// TODO: in the parsed output - how to distinguish column names/paths from string values?
// ex: filter=equals(displayName,lastName) => { '=' ['#displayName', '#lastName']}

describe('parseIbmFilter() tests', () => {
  describe('equals() ibm operator', () => {
    testEachCase([
      {
        title: 'the "equals" ibm operator should map to the "=" sql operator for string values',
        queryString: "filter=equals(name,'michael')",
        expectedResults: { '=': ['name', 'michael'] }
      },
    ])
  })

  // eslint-disable-next-line jest/expect-expect
  test.only('parseExpressionRec', () => {
    const result = parseExpressionRec("and(any(age,'21','22','23'),not(equals(name,'brad')))")
    const expected = {'AND': [{'IN': ['#age', 21, 22, 23]},{'NOT': {'=': ['#name', 'brad']}}]}
    expect(result)
      .toEqual(expected)

  })

  test.skip('asdf', () => {
    expect(tokenizeExpression("equals(name,'michael')"))
      .toEqual(['equals', 'name', "'michael'"])
    
    expect(tokenizeExpression("and(any(age,'21','22','23'),not(equals(name,'brad')))"))
      .toEqual(['and', 'any', 'age', "'21'", "'22'", "'23'", 'not', 'equals', 'name', "'brad'"])
  })

  // TODO: make better
  describe.skip('other errors', () => {
    testEachCase([
      {
        title: 'uneven parenthesis 1',
        queryString: "filter=equals(name,'michael'",
        expectedErrors: [new Error('uneven parenthesis found')]
      },
      {
        title: 'uneven parenthesis 2',
        queryString: "filter=equalsname,'michael')",
        expectedErrors: [new Error('uneven parenthesis found')]
      },
      // {
      //   title: 'uneven parenthesis 3',
      //   queryString: "filter=equalsname,'michael'",
      //   expectedErrors: [new Error('uneven parenthesis found')]
      // },
      {
        title: 'uneven parenthesis 4',
        queryString: "filter=andequals(name,'michael'),has(x))",
        expectedErrors: [new Error('uneven parenthesis found')]
      },
      {
        title: 'uneven parenthesis 5',
        queryString: "filter=and(equalsname,'michael'),has(x))",
        expectedErrors: [new Error('uneven parenthesis found')]
      },
      {
        title: 'uneven parenthesis 6',
        queryString: "filter=and(equals(name,'michael'),has(x)",
        expectedErrors: [new Error('uneven parenthesis found')]
      },
    ])
  })

  
})