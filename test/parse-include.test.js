const parseInclude = require('../lib/parse-include')

describe('parseInclude', () => {
  const testCases = [
    {
      title: 'should return an array of relationship paths',
      queryString: 'include=children.movies.actors.children,children.movies.actors.pets,children.pets,pets',
      expectedResults: [
        'children.movies.actors.children',
        'children.movies.actors.pets',
        'children.pets',
        'pets'
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
    const { results, errors } = parseInclude(queryString)
    expect(results).toEqual(expectedResults)
    expect(errors).toEqual(expectedErrors || [])
  })
})
