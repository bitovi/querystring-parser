const { parseFilter } = require('../lib/parse-filter')

describe('parseFilter', () => {
  const testCases = [

    /**
     * Explicit Comparators
     */
    {
      title: 'should allow explicit "$eq" (mongodb comparator) for string value',
      queryString: 'filter[name][$eq]=michael',
      expectedResults: [
        { field: 'name', comparator: '=', value: 'michael' }
      ]
    },
    {
      title: 'should allow explicit "$eq" (mongodb comparator) for number value',
      queryString: 'filter[age][$eq]=1',
      expectedResults: [
        { field: 'age', comparator: '=', value: '1' }
      ]
    },
    {
      title: 'should allow explicit "$eq" (mongodb comparator) for date value',
      queryString: 'filter[start_date][$eq]=2020-01-01',
      expectedResults: [
        { field: 'start_date', comparator: '=', value: '2020-01-01' }
      ]
    },
    {
      title: 'should allow explicit "$ne" (mongodb comparator) for string value',
      queryString: 'filter[name][$ne]=michael',
      expectedResults: [
        { field: 'name', comparator: '!=', value: 'michael' }
      ]
    },
    {
      title: 'should allow explicit "$ne" (mongodb comparator) for number value',
      queryString: 'filter[age][$ne]=1',
      expectedResults: [
        { field: 'age', comparator: '!=', value: '1' }
      ]
    },
    {
      title: 'should allow explicit "$ne" (mongodb comparator) for date value',
      queryString: 'filter[start_date][$ne]=2020-01-01',
      expectedResults: [
        { field: 'start_date', comparator: '!=', value: '2020-01-01' }
      ]
    },
    {
      title: 'should allow explicit "$gt" (mongodb comparator)',
      queryString: 'filter[date][$gt]=2020-01-01',
      expectedResults: [
        { field: 'date', comparator: '>', value: '2020-01-01' }
      ]
    },
    {
      title: 'should allow explicit "$gte" (mongodb comparator)',
      queryString: 'filter[date][$gte]=2020-01-01',
      expectedResults: [
        { field: 'date', comparator: '>=', value: '2020-01-01' }
      ]
    },
    {
      title: 'should allow explicit "$lt" (mongodb comparator)',
      queryString: 'filter[date][$lt]=2020-01-01',
      expectedResults: [
        { field: 'date', comparator: '<', value: '2020-01-01' }
      ]
    },
    {
      title: 'should allow explicit "$lte" (mongodb comparator)',
      queryString: 'filter[date][$lte]=2020-01-01',
      expectedResults: [
        { field: 'date', comparator: '<=', value: '2020-01-01' }
      ]
    },
    {
      title: 'should allow explicit "ilike" (objection comparator)',
      queryString: 'filter[date][ilike]=michael',
      expectedResults: [
        { field: 'date', comparator: 'ilike', value: '%michael%' }
      ]
    },

    /**
     * Value Types and Defaults
     */
    {
      title: 'should generally default to "ilike" (objection comparator)',
      queryString: 'filter[name]=michael',
      expectedResults: [
        { field: 'name', comparator: 'ilike', value: '%michael%' }
      ]
    },
    {
      title: 'should default to "=" (objection comparator) for values that look like integers',
      queryString: 'filter[age]=1',
      expectedResults: [
        { field: 'age', comparator: '=', value: '1' }
      ]
    },
    {
      title: 'should default to "=" (objection comparator) for values that look like floats',
      queryString: 'filter[age]=1.5',
      expectedResults: [
        { field: 'age', comparator: '=', value: '1.5' }
      ]
    },
    {
      title: 'should default to "=" (objection comparator) for values that look like floats (with leading decimal point)',
      queryString: 'filter[age]=.5',
      expectedResults: [
        { field: 'age', comparator: '=', value: '.5' }
      ]
    },
    {
      title: 'should default to "=" (objection comparator) for values that look like dates',
      queryString: 'filter[start_date]=2020-01-01',
      expectedResults: [
        { field: 'start_date', comparator: '=', value: '2020-01-01' }
      ]
    },

    /**
     * Query String Missing
     */
    {
      title: 'should return 0 results when querystring is empty string',
      queryString: '',
      expectedResults: []
    },
    {
      title: 'should return 0 results when querystring is null',
      queryString: null,
      expectedResults: []
    },
    {
      title: 'should return 0 results when querystring is undefined',
      queryString: undefined,
      expectedResults: []
    }

    /**
     * Errors
     */
  ]

  test.concurrent.each(testCases)('$title', ({ queryString, expectedResults, expectedErrors }) => {
    const { results, errors } = parseFilter(queryString)
    expect(results).toEqual(expectedResults)

    if (expectedErrors) {
      expect(errors).toEqual(expectedErrors)
    } else {
      expect(errors).toEqual([])
    }
  })
})
