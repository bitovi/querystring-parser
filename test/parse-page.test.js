const parsePage = require('../lib/parse-page')

describe('parsePage', () => {
  const testCases = [
    {
      title: 'should return page number and size as integers in result',
      queryString: 'page[number]=1&page[size]=5',
      expectedResults: {
        number: 1,
        size: 5
      }
    },
    {
      title: 'should return empty object (no pagination) if neither number nor size were provided',
      queryString: 'fields[articles]=author',
      expectedResults: {}
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
      title: 'should return empty object when querystring is empty string',
      queryString: '',
      expectedResults: {}
    },
    {
      title: 'should return empty object when querystring is null',
      queryString: null,
      expectedResults: {}
    },
    {
      title: 'should return empty object when querystring is undefined',
      queryString: undefined,
      expectedResults: {}
    },

    /**
     * Errors
     */
    {
      title: 'should return error if number was provided but size was not',
      queryString: 'page[number]=1',
      expectedResults: {},
      expectedErrors: [
        new Error('Page number was provided but page size was not in querystring: \'page[number]=1\'')
      ]
    },
    {
      title: 'should return error if size was provided but number was not',
      queryString: 'page[size]=5',
      expectedResults: {},
      expectedErrors: [
        new Error('Page size was provided but page number was not in querystring: \'page[size]=5\'')
      ]
    },
    {
      title: 'should return error if invalid value was provided for page number',
      queryString: 'page[number]=nope&page[size]=5',
      expectedResults: {},
      expectedErrors: [
        new Error('Invalid page number provided in querystring: \'page[number]=nope&page[size]=5\'')
      ]
    },
    {
      title: 'should return error if invalid value was provided for page size',
      queryString: 'page[number]=1&page[size]=nope',
      expectedResults: {},
      expectedErrors: [
        new Error('Invalid page size provided in querystring: \'page[number]=1&page[size]=nope\'')
      ]
    },
    {
      title: 'should return error if invalid value was provided for page number',
      queryString: 'page[number]=-1&page[size]=5',
      expectedResults: {},
      expectedErrors: [
        new Error('Invalid page number provided in querystring: \'page[number]=-1&page[size]=5\'')
      ]
    },
    {
      title: 'should return error if invalid value was provided for page size',
      queryString: 'page[number]=1&page[size]=0',
      expectedResults: {},
      expectedErrors: [
        new Error('Invalid page size provided in querystring: \'page[number]=1&page[size]=0\'')
      ]
    }
  ]

  test.concurrent.each(testCases)('$title', ({ queryString, expectedResults, expectedErrors }) => {
    const { results, errors } = parsePage(queryString)
    expect(results).toEqual(expectedResults)
    expect(errors).toEqual(expectedErrors || [])
  })
})
