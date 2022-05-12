const { parseSort } = require('../lib/parse-sort')

describe('parseSort', () => {
  const testCases = [
    {
      title: 'should return an array of sort fields',
      queryString: 'sort=-date,name',
      expectedResults: [
        {
          field: 'date',
          direction: 'DESC'
        },
        {
          field: 'name',
          direction: 'ASC'
        }
      ]
    },

    /**
     * Alternate querystring formats
     */
    // TODO check for stuff like '?page=1' instead of '?page[number]=1
    // do this for the other things too like filter, fields, etc

    /**
     * Query String Missing
     */
    {
      title: 'should return empty array when querystring is empty string',
      queryString: '',
      expectedResults: []
    },
    {
      title: 'should return empty array when querystring is null',
      queryString: null,
      expectedResults: []
    },
    {
      title: 'should return empty array when querystring is undefined',
      queryString: undefined,
      expectedResults: []
    }

    /**
     * Errors
     */
    // {
    //   title: 'should return error if number was provided but size was not',
    //   queryString: 'page[number]=1',
    //   expectedResults: {},
    //   expectedErrors: [
    //     new Error('Page number was provided but page size was not in querystring: \'page[number]=1\'')
    //   ]
    // },
  ]

  test.concurrent.each(testCases)('$title', ({ queryString, expectedResults, expectedErrors }) => {
    const { results, errors } = parseSort(queryString)
    expect(results).toEqual(expectedResults)

    if (expectedErrors) {
      expect(errors).toEqual(expectedErrors)
    } else {
      expect(errors).toEqual([])
    }
  })
})
