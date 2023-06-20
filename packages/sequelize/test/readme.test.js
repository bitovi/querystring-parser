const { Op } = require("sequelize");
const parse = require("../lib/parse");

describe("readme", () => {
  const testCases = [
    {
      title: "should support sort parameters",
      querystring: "sort=-date,name",
      expectedResults: {
        orm: "sequelize",
        data: {
          order: [
            ["date", "DESC"],
            ["name", "ASC"],
          ],
        },
        errors: [],
      },
    },
    {
      title: "should support pagination parameters",
      querystring: "page[number]=1&page[size]=10",
      expectedResults: {
        orm: "sequelize",
        data: {
          offset: 0,
          limit: 10,
        },
        errors: [],
      },
    },
    {
      title: "should support fields parameters",
      querystring: "fields[people]=id,name",
      expectedResults: {
        orm: "sequelize",
        data: {
          attributes: ["id", "name"],
        },
        errors: [],
      },
    },
    {
      title: "should support include parameters",
      querystring: "include=pets,dogs",
      expectedResults: {
        orm: "sequelize",
        data: {
          include: [
            { association: "pets", include: [] },
            { association: "dogs", include: [] },
          ],
        },
        errors: [],
      },
    },
    {
      title: "should support filter parameters",
      querystring: "filter=and(any('age','10','20'),equals('name','mike'))",
      expectedResults: {
        orm: "sequelize",
        data: {
          where: {
            [Op.and]: [
              { age: { [Op.in]: [10, 20] } },
              { name: { [Op.eq]: "mike" } },
            ],
          },
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
