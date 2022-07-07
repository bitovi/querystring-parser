const parseSort = require("../lib/parse-sort");

describe("parsePage", () => {
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
        errors: ["page[number] and page[size] should be an integers"],
      },
    },

    {
      title: "should return an empty results array for an empty sort array",
      parameters: [{ number: "notANumber" }, []],
      expectedResults: {
        results: [],
        errors: ["page[number] and page[size] should be an integers"],
      },
    },

    {
      title: "should return an empty results array for an empty sort array",
      parameters: [{ number: 10, size: "notANumber" }, []],
      expectedResults: {
        results: [],
        errors: ["page[number] and page[size] should be an integers"],
      },
    },

    {
      title: "should return an empty results array for an empty sort array",
      parameters: [{ number: 10, size: 5 }, []],
      expectedResults: {
        results: [
          {
            results: [
              {
                fx: "offset",
                parameters: [10],
              },
              {
                fx: "limit",
                parameters: [5],
              },
            ],
          },
        ],
        errors: [],
      },
    },

    {
      title: "should return an empty results array for an empty sort array",
      parameters: [{ number: 20 }, []],
      expectedResults: {
        results: [
          {
            results: [
              {
                fx: "offset",
                parameters: [20],
              },
              {
                fx: "limit",
                parameters: [10],
              },
            ],
          },
        ],
        errors: [],
      },
    },
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
