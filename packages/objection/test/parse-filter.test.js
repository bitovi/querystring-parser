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
      parameters: [["field1", "field2"], ["FAILURE!"]],
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
        errors: ["Inlcude field should be an array"],
      },
    },

    {
      title: "should return an empty results array for an empty sort array",
      parameters: [[{ "=": ["#name", "michael"] }], []],
      expectedResults: {
        results: [
          {
            fx: "where",
            parameters: ["#name", "=", "michael"],
          },
        ],
        errors: [],
      },
    },

    {
      title: "should return an empty results array for an empty sort array",
      parameters: [[{ IN: ["#name", "brad", "mike"] }], []],
      expectedResults: {
        results: [
          {
            fx: "where",
            parameters: ["#name", "IN", ["brad", "mike"]],
          },
        ],
        errors: [],
      },
    },

    /**
     * Query String Missing
     */
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
