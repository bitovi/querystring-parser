const parseInclude = require("../lib/parse-include");

describe("parseInclude", () => {
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
      parameters: [["include1", "include2"], ["FAILURE!"]],
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
        errors: ["Include field should be an array"],
      },
    },

    {
      title: "should return valid results for valid parameters",
      parameters: [["include1", "include2"], []],
      expectedResults: {
        results: [
          {
            fx: "withGraphFetched",
            isNested: false,
            parameters: ["include1"],
          },
          {
            fx: "withGraphFetched",
            isNested: false,
            parameters: ["include2"],
          },
        ],
        errors: [],
      },
    },
  ];

  test.concurrent.each(testCases)(
    "$title",
    ({ parameters, expectedResults }) => {
      const results = parseInclude(...parameters);
      expect(results).toEqual(expectedResults);
    }
  );
});
