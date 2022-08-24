const parseFilter = require("../lib/parse-filter");

describe("parseFilter", () => {
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
        "should return empty results and no errors when an undefined filter is passed and the error is empty",
      parameters: [undefined, []],
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
      parameters: [{ "=": ["#name", "mike"] }, ["FAILURE!"]],
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
        errors: ["Filter field must be an object"],
      },
    },

    {
      title:
        "should return valid results for valid parameters for the '=' operator",
      parameters: [{ "=": ["#name", "michael"] }, []],
      expectedResults: {
        results: [
          {
            fx: "where",
            isNested: false,
            parameters: ["name", "=", "michael"],
          },
        ],
        errors: [],
      },
    },

    {
      title:
        "should return valid results for valid parameters for the 'not' operator",
      parameters: [{ "=": ["#name", "michael"] }, []],
      expectedResults: {
        results: [
          {
            fx: "where",
            isNested: false,
            parameters: ["name", "=", "michael"],
          },
        ],
        errors: [],
      },
    },

    {
      title: "should return valid results when using the 'AND' operator",
      parameters: [
        { AND: [{ IN: ["#age", 10, 20] }, { "=": ["#name", "mike"] }] },
        [],
      ],
      expectedResults: {
        results: [
          {
            fx: "where",
            isNested: true,
            parameters: [
              {
                fx: "whereIn",
                isNested: false,
                parameters: ["age", [10, 20]],
              },
              {
                fx: "where",
                isNested: false,
                parameters: ["name", "=", "mike"],
              },
            ],
          },
        ],
        errors: [],
      },
    },

    {
      title:
        "should return valid results when using the Nested 'AND' & 'OR' operator",
      parameters: [
        {
          AND: [
            { "=": ["#userType", "Student"] },
            {
              OR: [
                { "IS NULL": "#house" },
                {
                  AND: [{ "=": ["#id", 4] }, { "=": ["#house", "Gryffindor"] }],
                },
              ],
            },
          ],
        },
        [],
      ],

      expectedResults: {
        results: [
          {
            fx: "where",
            isNested: true,
            parameters: [
              {
                fx: "where",
                isNested: false,
                parameters: ["userType", "=", "Student"],
              },
              {
                fx: "where",
                isNested: true,
                parameters: [
                  {
                    fx: "whereNull",
                    isNested: false,
                    parameters: ["house"],
                  },
                  {
                    fx: "orWhere",
                    isNested: true,
                    parameters: [
                      {
                        fx: "where",
                        isNested: false,
                        parameters: ["id", "=", 4],
                      },
                      {
                        fx: "where",
                        isNested: false,
                        parameters: ["house", "=", "Gryffindor"],
                      },
                    ],
                  },
                ],
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
    ({ parameters, expectedResults }) => {
      const results = parseFilter(...parameters);
      expect(results).toEqual(expectedResults);
    }
  );
});
