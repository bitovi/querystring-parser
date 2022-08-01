const parseFields = require("../lib/parse-fields");

describe("parseFields", () => {
  const testCases = [
    {
      title:
        "should return empty results and no errors when both parameters are empty",
      parameters: [{}, []],
      expectedResults: {
        results: [],
        errors: [],
      },
    },

    {
      title:
        "should return an empty result and send back the error when an empty object and an error is passed",
      parameters: [{}, ["FAILURE!"]],
      expectedResults: {
        results: [],
        errors: ["FAILURE!"],
      },
    },

    {
      title:
        "should return an empty result and send back the error when a valid object with an error is passed",
      parameters: [{ test: ["field1", "field2"] }, ["FAILURE!"]],
      expectedResults: {
        results: [],
        errors: ["FAILURE!"],
      },
    },

    {
      title:
        "should return an error if a non object is passed as the first parameter",
      parameters: ["Hello world", []],
      expectedResults: {
        results: [],
        errors: ["Fields field should be an object"],
      },
    },

    {
      title: "should return valid results for valid parameters",
      parameters: [{ test: ["field1", "field2"] }, []],
      expectedResults: {
        results: [
          {
            fx: "select",
            parameters: ["field1", "field2"],
          },
        ],
        errors: [],
      },
    },
  ];

  test.concurrent.each(testCases)(
    "$title",
    ({ parameters, expectedResults }) => {
      const results = parseFields(...parameters);
      expect(results).toEqual(expectedResults);
    }
  );
});
