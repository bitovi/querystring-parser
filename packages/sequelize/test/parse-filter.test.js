const { Op } = require("sequelize");
const parseFilter = require("../lib/parse-filter");

describe("parseFilter", () => {
  const testCases = [
    {
      title:
        "should return empty results and no errors when both parameters are empty",
      parameters: [{}, []],
      expectedResults: {
        results: {},
        errors: [],
      },
    },

    {
      title:
        "should return empty results and no errors when an undefined filter is passed and the error is empty",
      parameters: [undefined, []],
      expectedResults: {
        results: {},
        errors: [],
      },
    },

    {
      title:
        "should return an empty result and send back the error when an empty object and an error is passed",
      parameters: [{}, ["FAILURE!"]],
      expectedResults: {
        results: {},
        errors: ["FAILURE!"],
      },
    },

    {
      title:
        "should return an empty result and send back the error when a valid object with an error is passed",
      parameters: [{ "=": ["#name", "mike"] }, ["FAILURE!"]],
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
        errors: ["Filter field must be an object"],
      },
    },

    {
      title:
        "should return valid results for valid parameters for the '=' operator",
      parameters: [{ "=": ["#name", "michael"] }, []],
      expectedResults: {
        results: {
          where: {
            name: {
              [Op.eq]: "michael",
            },
          },
        },
        errors: [],
      },
    },

    {
      title:
        "should return valid results for valid parameters for the '<' operator",
      parameters: [{ "<": ["#age", 3] }, []],
      expectedResults: {
        results: {
          where: {
            age: {
              [Op.lt]: 3,
            },
          },
        },
        errors: [],
      },
    },

    {
      title:
        "should return valid results for valid parameters for the '<=' operator",
      parameters: [{ "<=": ["#age", 3] }, []],
      expectedResults: {
        results: {
          where: {
            age: {
              [Op.lte]: 3,
            },
          },
        },
        errors: [],
      },
    },

    {
      title:
        "should return valid results for valid parameters for the '>' operator",
      parameters: [{ ">": ["#age", 3] }, []],
      expectedResults: {
        results: {
          where: {
            age: {
              [Op.gt]: 3,
            },
          },
        },
        errors: [],
      },
    },

    {
      title:
        "should return valid results for valid parameters for the '>=' operator",
      parameters: [{ ">=": ["#age", 3] }, []],
      expectedResults: {
        results: {
          where: {
            age: {
              [Op.gte]: 3,
            },
          },
        },
        errors: [],
      },
    },

    {
      title: "should return valid results when using the 'OR' operator",
      parameters: [
        { OR: [{ IN: ["#age", 10, 20] }, { "=": ["#name", "mike"] }] },
        [],
      ],
      expectedResults: {
        results: {
          where: {
            [Op.or]: [
              {
                age: {
                  [Op.in]: [10, 20],
                },
              },
              {
                name: {
                  [Op.eq]: "mike",
                },
              },
            ],
          },
        },
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
        results: {
          where: {
            [Op.and]: [
              {
                age: {
                  [Op.in]: [10, 20],
                },
              },
              {
                name: {
                  [Op.eq]: "mike",
                },
              },
            ],
          },
        },
        errors: [],
      },
    },

    {
      title: "should return valid results when using the 'NOT' operator",
      parameters: [{ NOT: { "=": ["#name", "mike"] } }, []],
      expectedResults: {
        results: {
          where: {
            [Op.not]: [
              {
                name: {
                  [Op.eq]: "mike",
                },
              },
            ],
          },
        },
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

describe("parseFilter operations tests", () => {
  const testCases = [
    //string
    {
      title: "should parse strings correctly with the $eq operator (Mongo)",
      parameters: [{ "=": ["#name", "John"] }, []],
      expectedResults: {
        errors: [],
        results: { where: { name: { [Op.eq]: "John" } } },
      },
    },
    {
      title: "should parse strings correctly with the $ne operator (Mongo)",
      parameters: [{ "<>": ["#name", "John"] }, []],
      expectedResults: {
        errors: [],
        results: { where: { name: { [Op.ne]: "John" } } },
      },
    },
    {
      title: "should parse strings correctly with the $gt operator (Mongo)",
      parameters: [{ ">": ["#name", "Jane"] }, []],
      expectedResults: {
        errors: [],
        results: { where: { name: { [Op.gt]: "Jane" } } },
      },
    },
    {
      title: "should parse strings correctly with the $gte operator (Mongo)",
      parameters: [{ ">=": ["#name", "Jane"] }, []],
      expectedResults: {
        errors: [],
        results: { where: { name: { [Op.gte]: "Jane" } } },
      },
    },
    {
      title: "should parse strings correctly with the $lt operator (Mongo)",
      parameters: [{ "<": ["#name", "John"] }, []],
      expectedResults: {
        errors: [],
        results: { where: { name: { [Op.lt]: "John" } } },
      },
    },
    {
      title: "should parse strings correctly with the $lte operator (Mongo)",
      parameters: [{ "<=": ["#name", "John"] }, []],
      expectedResults: {
        errors: [],
        results: { where: { name: { [Op.lte]: "John" } } },
      },
    },
    {
      title: "should parse strings correctly with the $in operator (Mongo)",
      parameters: [{ IN: ["#name", "John", "Jane"] }, []],
      expectedResults: {
        errors: [],
        results: { where: { name: { [Op.in]: ["John", "Jane"] } } },
      },
    },
    {
      title: "should parse strings correctly with the $nin operator (Mongo)",
      parameters: [{ "NOT IN": ["#name", "John", "Jane"] }, []],
      expectedResults: {
        errors: [],
        results: { where: { name: { [Op.notIn]: ["John", "Jane"] } } },
      },
    },
    {
      title:
        "should parse strings correctly with the $like operator - end of string",
      parameters: [{ LIKE: ["#name", "%ne"] }, []],
      expectedResults: {
        errors: [],
        results: { where: { name: { [Op.like]: "%ne" } } },
      },
    },
    {
      title:
        "should parse strings correctly with the $like operator - beginning of string",
      parameters: [{ LIKE: ["#name", "%ne"] }, []],
      expectedResults: {
        errors: [],
        results: { where: { name: { [Op.like]: "%ne" } } },
      },
    },
    {
      title:
        "should parse strings correctly with the $like operator - contains string",
      parameters: [{ LIKE: ["#name", "Jo%"] }, []],
      expectedResults: {
        errors: [],
        results: { where: { name: { [Op.like]: "Jo%" } } },
      },
    },
    {
      title:
        "should parse strings correctly with the $like operator - entire string",
      parameters: [{ LIKE: ["#name", "%an%"] }, []],
      expectedResults: {
        errors: [],
        results: { where: { name: { [Op.like]: "%an%" } } },
      },
    },
    {
      title:
        "should parse array of strings correctly with the $like operator - beginning of string",
      parameters: [{ LIKE: ["#name", "john", "jane"] }, []],
      expectedResults: {
        errors: [],
        results: {
          where: { name: { [Op.like]: { [Op.any]: ["john", "jane"] } } },
        },
      },
    },
    {
      title:
        "should parse strings correctly with the $ilike operator - end of string",
      parameters: [{ ILIKE: ["#name", "%NE"] }, []],
      expectedResults: {
        errors: [],
        results: { where: { name: { [Op.iLike]: "%NE" } } },
      },
    },
    {
      title:
        "should parse strings correctly with the $ilike operator - beginning of string",
      parameters: [{ ILIKE: ["#name", "JO%"] }, []],
      expectedResults: {
        errors: [],
        results: { where: { name: { [Op.iLike]: "JO%" } } },
      },
    },
    {
      title:
        "should parse array of strings correctly with the $ilike operator - beginning of string",
      parameters: [{ ILIKE: ["#name", "john", "jane"] }, []],
      expectedResults: {
        errors: [],
        results: {
          where: { name: { [Op.iLike]: { [Op.any]: ["john", "jane"] } } },
        },
      },
    },
    {
      title:
        "should parse strings correctly with the $ilike operator - contains string",
      parameters: [{ ILIKE: ["#name", "%An%"] }, []],
      expectedResults: {
        errors: [],
        results: { where: { name: { [Op.iLike]: "%An%" } } },
      },
    },
    {
      title:
        "should parse strings correctly with the $ilike operator - contains string",
      parameters: [{ ILIKE: ["#name", "jOhN"] }, []],
      expectedResults: {
        errors: [],
        results: { where: { name: { [Op.iLike]: "jOhN" } } },
      },
    },
    // numbers
    {
      title: "should parse numbers correctly with the $eq operator (Mongo)",
      parameters: [{ "=": ["#age", 35] }, []],
      expectedResults: {
        errors: [],
        results: { where: { age: { [Op.eq]: 35 } } },
      },
    },
    {
      title: "should parse numbers correctly with the $ne operator (Mongo)",
      parameters: [{ "<>": ["#age", 35] }, []],
      expectedResults: {
        errors: [],
        results: { where: { age: { [Op.ne]: 35 } } },
      },
    },
    {
      title: "should parse numbers correctly with the $gt operator (Mongo)",
      parameters: [{ ">": ["#age", 30] }, []],
      expectedResults: {
        errors: [],
        results: { where: { age: { [Op.gt]: 30 } } },
      },
    },
    {
      title: "should parse numbers correctly with the $lt operator (Mongo)",
      parameters: [{ "<": ["#age", 30] }, []],
      expectedResults: {
        errors: [],
        results: { where: { age: { [Op.lt]: 30 } } },
      },
    },
    {
      title: "returns correct data using the $lte operator with a number",
      parameters: [{ "<=": ["#age", 25] }, []],
      expectedResults: {
        errors: [],
        results: { where: { age: { [Op.lte]: 25 } } },
      },
    },
    {
      title: "returns correct data using the $gte operator with a number",
      parameters: [{ ">=": ["#age", 35] }, []],
      expectedResults: {
        errors: [],
        results: { where: { age: { [Op.gte]: 35 } } },
      },
    },
    {
      title: "should parse numbers correctly with the $in operator (Mongo)",
      parameters: [{ IN: ["#age", 25, 35] }, []],
      expectedResults: {
        errors: [],
        results: { where: { age: { [Op.in]: [25, 35] } } },
      },
    },
    {
      title: "should parse numbers correctly with the $nin operator (Mongo)",
      parameters: [{ "NOT IN": ["#age", 25, 35] }, []],
      expectedResults: {
        errors: [],
        results: { where: { age: { [Op.notIn]: [25, 35] } } },
      },
    },
    //arrays
    {
      title: "should parse arrays correctly with the $in operator (Mongo)",
      parameters: [{ IN: ["#name", "John", "Jane"] }, []],
      expectedResults: {
        errors: [],
        results: { where: { name: { [Op.in]: ["John", "Jane"] } } },
      },
    },
    {
      title: "should parse arrays correctly with the $nin operator (Mongo)",
      parameters: [{ "NOT IN": ["#name", "John", "Jane"] }, []],
      expectedResults: {
        errors: [],
        results: { where: { name: { [Op.notIn]: ["John", "Jane"] } } },
      },
    },
    //date
    {
      title: "should parse dates correctly with the $eq operator (Mongo)",
      parameters: [{ "=": ["#startDate", "2020-05-05T00:00:00.000Z"] }, []],
      expectedResults: {
        errors: [],
        results: {
          where: { startDate: { [Op.eq]: "2020-05-05T00:00:00.000Z" } },
        },
      },
    },
    {
      title: "should parse dates correctly with the $ne operator (Mongo)",
      parameters: [{ "<>": ["#startDate", "2020-05-05T00:00:00.000Z"] }, []],
      expectedResults: {
        errors: [],
        results: {
          where: { startDate: { [Op.ne]: "2020-05-05T00:00:00.000Z" } },
        },
      },
    },
    {
      title: "should parse dates correctly with the $gt operator (Mongo)",
      parameters: [{ ">": ["#startDate", "2020-12-12"] }, []],
      expectedResults: {
        errors: [],
        results: { where: { startDate: { [Op.gt]: "2020-12-12" } } },
      },
    },
    {
      title: "should parse dates correctly with the $lt operator (Mongo)",
      parameters: [{ "<": ["#startDate", "2020-12-12"] }, []],
      expectedResults: {
        errors: [],
        results: { where: { startDate: { [Op.lt]: "2020-12-12" } } },
      },
    },
    {
      title: "should parse dates correctly with the $lte operator (Mongo)",
      parameters: [{ "<=": ["#startDate", "2020-05-05"] }, []],
      expectedResults: {
        errors: [],
        results: { where: { startDate: { [Op.lte]: "2020-05-05" } } },
      },
    },
    {
      title: "returns correct data using the $gte operator with a date",
      parameters: [{ ">=": ["#startDate", "2021-01-05"] }, []],
      expectedResults: {
        errors: [],
        results: { where: { startDate: { [Op.gte]: "2021-01-05" } } },
      },
    },
    {
      title: "should parse dates correctly with the $in operator (Mongo)",
      parameters: [
        {
          IN: [
            "#startDate",
            "2020-05-05T00:00:00.000Z",
            "2021-01-05T00:00:00.000Z",
          ],
        },
        [],
      ],
      expectedResults: {
        errors: [],
        results: {
          where: {
            startDate: {
              [Op.in]: ["2020-05-05T00:00:00.000Z", "2021-01-05T00:00:00.000Z"],
            },
          },
        },
      },
    },
    {
      title: "should parse dates correctly with the $nin operator (Mongo)",
      parameters: [
        {
          "NOT IN": [
            "#startDate",
            "2020-05-05T00:00:00.000Z",
            "2021-01-05T00:00:00.000Z",
          ],
        },
        [],
      ],
      expectedResults: {
        errors: [],
        results: {
          where: {
            startDate: {
              [Op.notIn]: [
                "2020-05-05T00:00:00.000Z",
                "2021-01-05T00:00:00.000Z",
              ],
            },
          },
        },
      },
    },
    //boolean
    {
      title: "should parse booleans correctly with the $eq operator (Mongo)",
      parameters: [{ "=": ["#onSite", true] }, []],
      expectedResults: {
        errors: [],
        results: {
          where: { onSite: { [Op.eq]: true } },
        },
      },
    },
    {
      title: "should parse booleans correctly with the $in operator (Mongo)",
      parameters: [
        {
          AND: [{ IN: ["#onSite", true] }, { IN: ["#manager", false] }],
        },
        [],
      ],
      expectedResults: {
        errors: [],
        results: {
          where: {
            [Op.and]: [
              { onSite: { [Op.in]: [true] } },
              { manager: { [Op.in]: [false] } },
            ],
          },
        },
      },
    },
    {
      title: "should parse booleans correctly with the $nin operator (Mongo)",
      parameters: [
        {
          AND: [
            { "NOT IN": ["#onSite", true] },
            { "NOT IN": ["#manager", true] },
          ],
        },
        [],
      ],
      expectedResults: {
        errors: [],
        results: {
          where: {
            [Op.and]: [
              { onSite: { [Op.notIn]: [true] } },
              { manager: { [Op.notIn]: [true] } },
            ],
          },
        },
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
