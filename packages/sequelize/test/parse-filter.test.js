const { Op } = require("sequelize");
const parse = require("../lib/parse");
const parseFilter = require("../lib/parse-filter");

describe("parse", () => {
  const testCases = [
    {
      title: "should support numeric parameters",
      querystring: "filter[age]=1",
      expectedResults: {
        orm: "sequelize",
        data: {
          where: { age: { [Op.eq]: 1 } },
        },
        errors: [],
      },
    },
    {
      title: "should support boolean parameters",
      querystring: "filter[active]=true",
      expectedResults: {
        orm: "sequelize",
        data: {
          where: { active: { [Op.eq]: true } },
        },
        errors: [],
      },
    },
    {
      title: "should support boolean parameters",
      querystring: "filter[active]=false",
      expectedResults: {
        orm: "sequelize",
        data: {
          where: { active: { [Op.eq]: false } },
        },
        errors: [],
      },
    },
    {
      title: "should support boolean parameters",
      querystring: "filter=equals(active,'true')",
      expectedResults: {
        orm: "sequelize",
        data: {
          where: { active: { [Op.eq]: true } },
        },
        errors: [],
      },
    },
    {
      title: "should support boolean parameters",
      querystring: "filter=equals(active,'false')",
      expectedResults: {
        orm: "sequelize",
        data: {
          where: { active: { [Op.eq]: false } },
        },
        errors: [],
      },
    },
  ];

  test.concurrent.each(testCases)(
    "$title",
    ({ querystring, expectedResults }) => {
      expect(parse(querystring)).toEqual(expectedResults);
    }
  );
});

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
