const parseInclude = require("../lib/parse-include");

describe("parseInclude", () => {
  const testCases = [
    {
      title:
        "should return empty results and no errors when both parameters are empty",
      parameters: [[], []],
      expectedResults: {
        results: {},
        errors: [],
      },
    },

    {
      title:
        "should return an empty result and send back the error when an empty object and an error is passed",
      parameters: [[], ["FAILURE!"]],
      expectedResults: {
        results: {},
        errors: ["FAILURE!"],
      },
    },

    {
      title:
        "should return an empty result and send back the error when a valid object with an error is passed",
      parameters: [["include1", "include2"], ["FAILURE!"]],
      expectedResults: {
        results: {},
        errors: ["FAILURE!"],
      },
    },

    {
      title:
        "should return an error when an invalid type is passed as the first parameter",
      parameters: ["Hello world", []],
      expectedResults: {
        results: {},
        errors: ["Include field should be an array"],
      },
    },

    {
      title: "should return valid results for valid parameters",
      parameters: [["include1", "include2.test"], []],
      expectedResults: {
        results: {
          distinct: true,
          include: [
            {
              association: "include1",
              include: [],
            },
            {
              association: "include2",
              include: [
                {
                  association: "test",
                  include: [],
                },
              ],
            },
          ],
        },
        errors: [],
      },
    },

    {
      title: "should return valid results for include/exclude attributes",
      parameters: [
        ["include1", "include2.test"],
        [],
        {
          "": ["id"],
          include1: ["title", "body", "-abstract"],
          "include2.test": ["name"],
        },
      ],
      expectedResults: {
        results: {
          attributes: ["id"],
          distinct: true,
          include: [
            {
              association: "include1",
              attributes: {
                include: ["title", "body"],
                exclude: ["abstract"],
              },
              include: [],
            },
            {
              association: "include2",
              include: [
                {
                  association: "test",
                  attributes: ["name"],
                  include: [],
                },
              ],
            },
          ],
        },
        errors: [],
      },
    },
  ];

  test.concurrent.each(testCases)(
    "$title",
    ({ parameters, expectedResults }) => {
      const results = parseInclude(...parameters);
      expect(results).toEqual(expectedResults);
    },
  );
});
