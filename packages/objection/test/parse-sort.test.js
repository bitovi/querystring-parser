const parseSort = require("../lib/parse-sort");

describe("parseSort", () => {
  const testCases = [
    {
      title: "should return an empty results array for an empty sort array",
      parameters: [[], []],
      expectedResults: {
        results: [],
        errors: [],
      },
    },

    {
      title: "should return an empty results array for an empty sort array",
      parameters: [[], ["FAILURE!"]],
      expectedResults: {
        results: [],
        errors: ["FAILURE!"],
      },
    },

    {
      title: "should return an empty results array for an empty sort array",
      parameters: [[{ field: "test", direction: "ASC" }], ["FAILURE!"]],
      expectedResults: {
        results: [],
        errors: ["FAILURE!"],
      },
    },

    {
      title: "should return an empty results array for an empty sort array",
      parameters: ["Hello world", []],
      expectedResults: {
        results: [],
        errors: ["Sort field should be an array"],
      },
    },

    {
      title: "should return an empty results array for an empty sort array",
      parameters: [[{ field: "test", direction: "ASC" }], []],
      expectedResults: {
        results: [
          {
            fx: "orderBy",
            parameters: [{ column: "test", order: "ASC" }],
          },
        ],
        errors: [],
      },
    },

    /**
     * Alternate querystring formats
     */
    // {
    //   title: "should return empty array when querystring is empty string",
    //   parameters: "",
    //   expectedResults: [],
    // },
    // {
    //   title: "should return empty array when querystring is null",
    //   parameters: null,
    //   expectedResults: [],
    // },
    // {
    //   title: "should return empty array when querystring is undefined",
    //   parameters: undefined,
    //   expectedResults: [],
    // },

    /**
     * Errors
     */
    // {
    //   title: 'should return error if number was provided but size was not',
    //   parameters: 'page[number]=1',
    //   expectedResults: {},
    //   expectedErrors: [
    //     new Error('Page number was provided but page size was not in parameters: \'page[number]=1\'')
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
