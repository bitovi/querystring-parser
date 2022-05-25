const { parseFilter, parseMongoDBFilter } = require('../lib/parse-filter-new')

function testEachCase(testCases) {
  test.concurrent.each(testCases)('$title', ({ queryString, expectedResults, expectedErrors }) => {
    const { results, errors } = parseMongoDBFilter(queryString)
    expect(results).toEqual(expectedResults || undefined)
    expect(errors).toEqual(expectedErrors || [])
  })
}

describe('parseMongoDBFilter() tests', () => {
  describe('$eq mongo operator', () => {
    testEachCase([
      {
        title: 'the "$eq" mongo operator should map to the "=" sql operator for string values',
        queryString: 'filter[name][$eq]=michael',
        expectedResults: { '=': ['name', 'michael'] }
      },
      {
        title: 'the "$eq" mongo operator should map to the "=" sql operator for number values',
        queryString: 'filter[age][$eq]=25',
        expectedResults: { '=': ['age', 25] }
      },
      {
        title: 'the "$eq" mongo operator should map to the "=" sql operator for date values',
        queryString: 'filter[born][$eq]=2020-01-01',
        expectedResults: { '=': ['born', '2020-01-01'] }
      },
      {
        title: 'the "$eq" mongo operator should map to the "IS NULL" sql operator for null values',
        queryString: 'filter[age][$eq]=null',
        expectedResults: { 'IS NULL': 'age' }
      },
      {
        title: 'the "$eq" mongo operator should not allow array values',
        queryString: 'filter[age][$eq]=24,25',
        expectedErrors: [new Error('"$eq" operator should not be used with array value')]
      },
    ])
  })

  describe('$ne mongo operator', () => {
    testEachCase([
      {
        title: 'the "$ne" mongo operator should map to the "<>" sql operator for string values',
        queryString: 'filter[name][$ne]=michael',
        expectedResults: { '<>': ['name', 'michael'] }
      },
      {
        title: 'the "$ne" mongo operator should map to the "<>" sql operator for number values',
        queryString: 'filter[age][$ne]=25',
        expectedResults: { '<>': ['age', 25] }
      },
      {
        title: 'the "$ne" mongo operator should map to the "<>" sql operator for date values',
        queryString: 'filter[born][$ne]=2020-01-01',
        expectedResults: { '<>': ['born', '2020-01-01'] }
      },
      {
        title: 'the "$ne" mongo operator should map to the "IS NOT NULL" sql operator for null values',
        queryString: 'filter[age][$ne]=null',
        expectedResults: { 'IS NOT NULL': 'age' }
      },
      {
        title: 'the "$ne" mongo operator should not allow array values',
        queryString: 'filter[age][$ne]=24,25',
        expectedErrors: [new Error('"$ne" operator should not be used with array value')]
      },
    ])
  })

  describe('$gt mongo operator', () => {
    testEachCase([
      {
        title: 'the "$gt" mongo operator should map to the ">" sql operator for string values',
        queryString: 'filter[name][$gt]=michael',
        expectedResults: { '>': ['name', 'michael'] }
      },
      {
        title: 'the "$gt" mongo operator should map to the ">" sql operator for number values',
        queryString: 'filter[age][$gt]=25',
        expectedResults: { '>': ['age', 25] }
      },
      {
        title: 'the "$gt" mongo operator should map to the ">" sql operator for date values',
        queryString: 'filter[born][$gt]=2020-01-01',
        expectedResults: { '>': ['born', '2020-01-01'] }
      },
      {
        title: 'the "$gt" mongo operator should not allow null values',
        queryString: 'filter[age][$gt]=null',
        expectedErrors: [new Error('"$gt" operator should not be used with null value')]
      },
      {
        title: 'the "$gt" mongo operator should not allow array values',
        queryString: 'filter[age][$gt]=24,25',
        expectedErrors: [new Error('"$gt" operator should not be used with array value')]
      },
    ])
  })

  describe('$gte mongo operator', () => {
    testEachCase([
      {
        title: 'the "$gte" mongo operator should map to the ">=" sql operator for string values',
        queryString: 'filter[name][$gte]=michael',
        expectedResults: { '>=': ['name', 'michael'] }
      },
      {
        title: 'the "$gte" mongo operator should map to the ">=" sql operator for number values',
        queryString: 'filter[age][$gte]=25',
        expectedResults: { '>=': ['age', 25] }
      },
      {
        title: 'the "$gte" mongo operator should map to the ">=" sql operator for date values',
        queryString: 'filter[born][$gte]=2020-01-01',
        expectedResults: { '>=': ['born', '2020-01-01'] }
      },
      {
        title: 'the "$gte" mongo operator should not allow null values',
        queryString: 'filter[age][$gte]=null',
        expectedErrors: [new Error('"$gte" operator should not be used with null value')]
      },
      {
        title: 'the "$gte" mongo operator should not allow array values',
        queryString: 'filter[age][$gte]=24,25',
        expectedErrors: [new Error('"$gte" operator should not be used with array value')]
      },
    ])
  })

  describe('$lt mongo operator', () => {
    testEachCase([
      {
        title: 'the "$lt" mongo operator should map to the "<" sql operator for string values',
        queryString: 'filter[name][$lt]=michael',
        expectedResults: { '<': ['name', 'michael'] }
      },
      {
        title: 'the "$lt" mongo operator should map to the "<" sql operator for number values',
        queryString: 'filter[age][$lt]=25',
        expectedResults: { '<': ['age', 25] }
      },
      {
        title: 'the "$lt" mongo operator should map to the "<" sql operator for date values',
        queryString: 'filter[born][$lt]=2020-01-01',
        expectedResults: { '<': ['born', '2020-01-01'] }
      },
      {
        title: 'the "$lt" mongo operator should not allow null values',
        queryString: 'filter[age][$lt]=null',
        expectedErrors: [new Error('"$lt" operator should not be used with null value')]
      },
      {
        title: 'the "$lt" mongo operator should not allow array values',
        queryString: 'filter[age][$lt]=24,25',
        expectedErrors: [new Error('"$lt" operator should not be used with array value')]
      },
    ])
  })

  describe('$lte mongo operator', () => {
    testEachCase([
      {
        title: 'the "$lte" mongo operator should map to the "<=" sql operator for string values',
        queryString: 'filter[name][$lte]=michael',
        expectedResults: { '<=': ['name', 'michael'] }
      },
      {
        title: 'the "$lte" mongo operator should map to the "<=" sql operator for number values',
        queryString: 'filter[age][$lte]=25',
        expectedResults: { '<=': ['age', 25] }
      },
      {
        title: 'the "$lte" mongo operator should map to the "<=" sql operator for date values',
        queryString: 'filter[born][$lte]=2020-01-01',
        expectedResults: { '<=': ['born', '2020-01-01'] }
      },
      {
        title: 'the "$lte" mongo operator should not allow null values',
        queryString: 'filter[age][$lte]=null',
        expectedErrors: [new Error('"$lte" operator should not be used with null value')]
      },
      {
        title: 'the "$lte" mongo operator should not allow array values',
        queryString: 'filter[age][$lte]=24,25',
        expectedErrors: [new Error('"$lte" operator should not be used with array value')]
      },
    ])
  })

  describe('ilike mongo operator', () => {
    testEachCase([
      {
        title: 'the "ilike" mongo operator should map to the "LIKE" sql operator for string values',
        queryString: 'filter[name][ilike]=michael',
        expectedResults: { 'LIKE': ['name', '%michael%'] }
      },
      {
        title: 'the "ilike" mongo operator should not allow null values',
        queryString: 'filter[name][ilike]=null',
        expectedErrors: [new Error('"ilike" operator should not be used with null value')]
      },
      {
        title: 'the "ilike" mongo operator should not allow array values',
        queryString: 'filter[age][ilike]=24,25',
        expectedErrors: [new Error('"ilike" operator should not be used with array value')]
      },
    ])
  })

  // TODO: edge case where single value is prided with $in operator
  // TODO: edge case where array values are of different types
  // TODO: edge cases for all data types that are not allowed with operators (finished: null, array, pu@string)
  // TODO: cover old tests in case I missed something
  // TODO: check for duplicate values in array value?
  describe('$in mongo operator', () => {
    testEachCase([
      {
        title: 'the "$in" mongo operator should map to the "IN" sql operator for string values',
        queryString: 'filter[name][$in]=michael,brad',
        expectedResults: { 'IN': ['name', ['michael', 'brad']] }
      },
      {
        title: 'the "$in" mongo operator should map to the "IN" sql operator for number values',
        queryString: 'filter[age][$in]=24,25',
        expectedResults: { 'IN': ['age', [24, 25]] }
      },
      {
        title: 'the "$in" mongo operator should map to the "IN" sql operator for date values',
        queryString: 'filter[born][$in]=2020-01-01,2021-01-01',
        expectedResults: { 'IN': ['born', ['2020-01-01', '2021-01-01']] }
      },
      { // TODO: not the best language, top level maybe?
        title: 'the "$in" mongo operator should not allow null values',
        queryString: 'filter[age][$in]=null',
        expectedErrors: [new Error('"$in" operator should not be used with null value')]
      },
    ])
  })

  describe('$nin mongo operator', () => {
    testEachCase([
      {
        title: 'the "$nin" mongo operator should map to the "NOT IN" sql operator for string values',
        queryString: 'filter[name][$nin]=michael,brad',
        expectedResults: { 'NOT IN': ['name', ['michael', 'brad']] }
      },
      {
        title: 'the "$nin" mongo operator should map to the "NOT IN" sql operator for number values',
        queryString: 'filter[age][$nin]=24,25',
        expectedResults: { 'NOT IN': ['age', [24, 25]] }
      },
      {
        title: 'the "$nin" mongo operator should map to the "NOT IN" sql operator for date values',
        queryString: 'filter[born][$nin]=2020-01-01,2021-01-01',
        expectedResults: { 'NOT IN': ['born', ['2020-01-01', '2021-01-01']] }
      },
      { // TODO: not the best language, top level maybe?
        title: 'the "$nin" mongo operator should not allow null values',
        queryString: 'filter[age][$nin]=null',
        expectedErrors: [new Error('"$nin" operator should not be used with null value')]
      },
    ])
  })

  describe('implicit/omitted/default operator', () => {
    testEachCase([
      {
        title: 'the "LIKE" sql operator should be the default for string values',
        queryString: 'filter[name]=michael',
        expectedResults: { 'LIKE': ['name', '%michael%'] }
      },
      {
        title: 'the "=" sql operator should be the default for number values',
        queryString: 'filter[age]=25',
        expectedResults: { '=': ['age', 25] }
      },
      {
        title: 'the "=" sql operator should be the default for date values',
        queryString: 'filter[born]=2020-01-01',
        expectedResults: { '=': ['born', '2020-01-01'] }
      },
      {
        title: 'the "IS NULL" sql operator should be the default for null values',
        queryString: 'filter[age]=null',
        expectedResults: { 'IS NULL': 'age' }
      },
      
      // Array types
      {
        title: 'the "IN" sql operator should be the default for string[] (string array) values',
        queryString: 'filter[name]=michael,brad',
        expectedResults: { 'IN': ['name', ['michael', 'brad']] }
      },
      {
        title: 'the "IN" sql operator should be the default for number[] (number array) values',
        queryString: 'filter[age]=24,25',
        expectedResults: { 'IN': ['age', [24, 25]] }
      },
      {
        title: 'the "IN" sql operator should be the default for date[] (date array) values',
        queryString: 'filter[born]=2020-01-01,2021-01-01',
        expectedResults: { 'IN': ['born', ['2020-01-01', '2021-01-01']] }
      },
    ])
  })
})

// describe.skip('parseFilter', () => {
//   const testCases = [

//     /**
//      * Explicit Comparators
//      */
//     {
//       title: 'should allow explicit "$eq" (mongodb comparator) for string value',
//       queryString: 'filter[name][$eq]=michael',
//       expectedResults: [
//         { field: 'name', comparator: '=', value: 'michael' }
//       ]
//     },
//     {
//       title: 'should allow explicit "$eq" (mongodb comparator) for number value',
//       queryString: 'filter[age][$eq]=1',
//       expectedResults: [
//         { field: 'age', comparator: '=', value: '1' }
//       ]
//     },
//     {
//       title: 'should allow explicit "$eq" (mongodb comparator) for date value',
//       queryString: 'filter[start_date][$eq]=2020-01-01',
//       expectedResults: [
//         { field: 'start_date', comparator: '=', value: '2020-01-01' }
//       ]
//     },
//     {
//       title: 'should allow explicit "$ne" (mongodb comparator) for string value',
//       queryString: 'filter[name][$ne]=michael',
//       expectedResults: [
//         { field: 'name', comparator: '!=', value: 'michael' }
//       ]
//     },
//     {
//       title: 'should allow explicit "$ne" (mongodb comparator) for number value',
//       queryString: 'filter[age][$ne]=1',
//       expectedResults: [
//         { field: 'age', comparator: '!=', value: '1' }
//       ]
//     },
//     {
//       title: 'should allow explicit "$ne" (mongodb comparator) for date value',
//       queryString: 'filter[start_date][$ne]=2020-01-01',
//       expectedResults: [
//         { field: 'start_date', comparator: '!=', value: '2020-01-01' }
//       ]
//     },
//     {
//       title: 'should allow explicit "$gt" (mongodb comparator)',
//       queryString: 'filter[date][$gt]=2020-01-01',
//       expectedResults: [
//         { field: 'date', comparator: '>', value: '2020-01-01' }
//       ]
//     },
//     {
//       title: 'should allow explicit "$gte" (mongodb comparator)',
//       queryString: 'filter[date][$gte]=2020-01-01',
//       expectedResults: [
//         { field: 'date', comparator: '>=', value: '2020-01-01' }
//       ]
//     },
//     {
//       title: 'should allow explicit "$lt" (mongodb comparator)',
//       queryString: 'filter[date][$lt]=2020-01-01',
//       expectedResults: [
//         { field: 'date', comparator: '<', value: '2020-01-01' }
//       ]
//     },
//     {
//       title: 'should allow explicit "$lte" (mongodb comparator)',
//       queryString: 'filter[date][$lte]=2020-01-01',
//       expectedResults: [
//         { field: 'date', comparator: '<=', value: '2020-01-01' }
//       ]
//     },
//     {
//       title: 'should allow explicit "ilike" (objection comparator)',
//       queryString: 'filter[date][ilike]=michael',
//       expectedResults: [
//         { field: 'date', comparator: 'ilike', value: '%michael%' }
//       ]
//     },

//     /**
//      * Value Types and Defaults
//      */
//     {
//       title: 'should generally default to "ilike" (objection comparator)',
//       queryString: 'filter[name]=michael',
//       expectedResults: [
//         { field: 'name', comparator: 'ilike', value: '%michael%' }
//       ]
//     },
//     {
//       title: 'should default to "=" (objection comparator) for values that look like integers',
//       queryString: 'filter[age]=1',
//       expectedResults: [
//         { field: 'age', comparator: '=', value: '1' }
//       ]
//     },
//     {
//       title: 'should default to "=" (objection comparator) for values that look like floats',
//       queryString: 'filter[age]=1.5',
//       expectedResults: [
//         { field: 'age', comparator: '=', value: '1.5' }
//       ]
//     },
//     {
//       title: 'should default to "=" (objection comparator) for values that look like floats (with leading decimal point)',
//       queryString: 'filter[age]=.5',
//       expectedResults: [
//         { field: 'age', comparator: '=', value: '.5' }
//       ]
//     },
//     {
//       title: 'should default to "=" (objection comparator) for values that look like dates',
//       queryString: 'filter[start_date]=2020-01-01',
//       expectedResults: [
//         { field: 'start_date', comparator: '=', value: '2020-01-01' }
//       ]
//     },

//     /**
//      * Query String Missing
//      */
//     {
//       title: 'should return 0 results when querystring is empty string',
//       queryString: '',
//       expectedResults: []
//     },
//     {
//       title: 'should return 0 results when querystring is null',
//       queryString: null,
//       expectedResults: []
//     },
//     {
//       title: 'should return 0 results when querystring is undefined',
//       queryString: undefined,
//       expectedResults: []
//     }

//     /**
//      * Errors
//      */
//   ]

//   test.concurrent.each(testCases)('$title', ({ queryString, expectedResults, expectedErrors }) => {
//     const { results, errors } = parseFilter(queryString)
//     expect(results).toEqual(expectedResults)
//     expect(errors).toEqual(expectedErrors || [])
//   })
// })
