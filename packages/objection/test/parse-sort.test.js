const parseSort = require("../lib/parse-sort");

describe("parseSort", () => {
  const testCases = [
    {
      title:
        "should return empty results and no errors when both parameters are empty",
      parameters: [[], []],
      expectedResults: {
        results: [],
        errors: [],
      },
    },

    {
      title:
        "should return an empty result and send back the error when an empty object and an error is passed",
      parameters: [[], ["FAILURE!"]],
      expectedResults: {
        results: [],
        errors: ["FAILURE!"],
      },
    },

    {
      title:
        "should return an empty result and send back the error when a valid object with an error is passed",
      parameters: [[{ field: "test", direction: "ASC" }], ["FAILURE!"]],
      expectedResults: {
        results: [],
        errors: ["FAILURE!"],
      },
    },

    {
      title:
        "should return an error when an invalid type is passed as the first parameter",
      parameters: ["Hello world", []],
      expectedResults: {
        results: [],
        errors: ["Sort field should be an array"],
      },
    },

    {
      title: "should return valid results for valid parameters",
      parameters: [[{ field: "test", direction: "ASC" }], []],
      expectedResults: {
        results: [
          {
            fx: "orderBy",
            isNested: false,
            parameters: [[{ column: "test", order: "ASC" }]],
          },
        ],
        errors: [],
      },
    },
  ];

  test.concurrent.each(testCases)(
    "$title",
    ({ parameters, expectedResults }) => {
      const results = parseSort(...parameters);
      expect(results).toEqual(expectedResults);
    },
  );
});
