const parseSort = require("../lib/parse-sort");

describe("parseSort", () => {
  const testCases = [
    {
      title: "should return an array of sort fields",
      querystring: "sort=-date,name",
      expectedResults: [
        {
          field: "date",
          direction: "DESC",
        },
        {
          field: "name",
          direction: "ASC",
        },
      ],
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
      title: "should return empty array when querystring is empty string",
      querystring: "",
      expectedResults: [],
    },
    {
      title: "should return empty array when querystring is null",
      querystring: null,
      expectedResults: [],
    },
    {
      title: "should return empty array when querystring is undefined",
      querystring: undefined,
      expectedResults: [],
    },

    /**
     * Errors
     */
    // {
    //   title: 'should return error if number was provided but size was not',
    //   querystring: 'page[number]=1',
    //   expectedResults: {},
    //   expectedErrors: [
    //     new Error('Page number was provided but page size was not in querystring: \'page[number]=1\'')
    //   ]
    // },
  ];

  test.concurrent.each(testCases)(
    "$title",
    ({ querystring, expectedResults, expectedErrors }) => {
      const { results, errors } = parseSort(querystring);
      expect(results).toEqual(expectedResults);
      expect(errors).toEqual(expectedErrors || []);
    }
  );
});
