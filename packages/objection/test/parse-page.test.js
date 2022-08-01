const parsePage = require("../lib/parse-page");

describe("parsePage", () => {
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
      parameters: [{ number: 10, size: 20 }, ["FAILURE!"]],
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
        errors: ["Page field should be an Object"],
      },
    },

    {
      title:
        "should return an error if an invalid string is passed as the page number",
      parameters: [{ number: "notANumber" }, []],
      expectedResults: {
        results: [],
        errors: ["page[number] and page[size] should be integers"],
      },
    },

    {
      title:
        "should return an error if an invalid string is passed as the page size",
      parameters: [{ number: 10, size: "notANumber" }, []],
      expectedResults: {
        results: [],
        errors: ["page[number] and page[size] should be integers"],
      },
    },

    {
      title: "should return valid results for valid parameters",
      parameters: [{ number: 3, size: 5 }, []],
      expectedResults: {
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
        errors: [],
      },
    },

    {
      title:
        "should return valid result and set a default of 10 if page size is not set",
      parameters: [{ number: 2 }, []],
      expectedResults: {
        results: [
          {
            fx: "offset",
            parameters: [10],
          },
          {
            fx: "limit",
            parameters: [10],
          },
        ],
        errors: [],
      },
    },
  ];

  test.concurrent.each(testCases)(
    "$title",
    ({ parameters, expectedResults }) => {
      const results = parsePage(...parameters);
      expect(results).toEqual(expectedResults);
    }
  );
});
