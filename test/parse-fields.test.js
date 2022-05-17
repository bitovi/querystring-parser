const { parseFields } = require('../lib/parse-fields')

describe('parseFields', () => {
  const testCases = [
    {
      title: 'should return fields for multiple types',
      queryString: 'fields[articles]=title,body&fields[people]=name',
      expectedResults: {
        articles: [
          'title',
          'body'
        ],
        people: ['name']
      }
    },
    {
      title: 'should not include empty strings as fields',
      queryString: 'fields[articles]=',
      expectedResults: {
        articles: []
      }
    },
    {
      title: 'should default to empty object if no fields were specified',
      queryString: 'filter[name]=michael',
      expectedResults: {}
    },

    /**
     * Alternate querystring formats
     */
    {
      title: 'should return combined fields for types that are specified more than once',
      queryString: 'fields[articles]=a&fields[articles]=b&fields[articles]=',
      expectedResults: {
        articles: [
          'a',
          'b'
        ]
      }
    },

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
      title: 'should return error if type was not specified',
      queryString: 'fields[articles]=title,body&fields=name',
      expectedResults: {
        articles: [
          'title',
          'body'
        ]
      },
      expectedErrors: [
        new Error('Incorrect format for fields in querystring: \'fields[articles]=title,body&fields=name\'')
      ]
    },
    {
      title: 'should return error if type has duplicate fields, and remove the duplicate fields',
      queryString: 'fields[cats]=name,name&fields[dogs]=name&fields[dogs]=name&fields[snakes]=name',
      expectedResults: {
        cats: [
          'name'
        ],
        dogs: [
          'name'
        ],
        snakes: [
          'name'
        ]
      },
      expectedErrors: [
        new Error('Duplicated field \'name\' for type \'cats\' detected in querystring: \'fields[cats]=name,name&fields[dogs]=name&fields[dogs]=name&fields[snakes]=name\''),
        new Error('Duplicated field \'name\' for type \'dogs\' detected in querystring: \'fields[cats]=name,name&fields[dogs]=name&fields[dogs]=name&fields[snakes]=name\'')
      ]
    }
  ]

  test.concurrent.each(testCases)('$title', ({ queryString, expectedResults, expectedErrors }) => {
    const { results, errors } = parseFields(queryString)
    expect(results).toEqual(expectedResults)
    expect(errors).toEqual(expectedErrors || [])
  })
})
