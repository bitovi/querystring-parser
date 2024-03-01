const { Op } = require("sequelize");
const { getSequelizeFindOptions, parse } = require("../lib/parse");

describe("getSequelizeFindOptions", () => {
  it("combines all parsers", () => {
    expect(
      getSequelizeFindOptions({
        filter: { "=": ["#name", "laundry"] },
        fields: { "": ["id", "name", "dueDate"], user: ["name"] },
        page: { number: 3, size: 5 },
        sort: [],
        include: ["user"],
        errors: { filter: [], fields: [], page: [], sort: [], include: [] },
      }),
    ).toEqual({
      orm: "sequelize",
      data: {
        attributes: ["id", "name", "dueDate"],
        where: {
          name: { [Op.eq]: "laundry" },
        },
        include: [
          {
            association: "user",
            include: [],
            attributes: ["name"],
          },
        ],
        offset: 10,
        limit: 5,
        subQuery: false,
      },
      errors: [],
    });
  });
});

describe("parse", () => {
  it("combines all parsers", () => {
    expect(
      parse(
        "include=user&filter[name]=laundry&fields[]=id,name,dueDate&fields[user]=name&page[number]=3&page[size]=5",
      ),
    ).toEqual({
      orm: "sequelize",
      data: {
        attributes: ["id", "name", "dueDate"],
        where: {
          name: { [Op.eq]: "laundry" },
        },
        include: [
          {
            association: "user",
            include: [],
            attributes: ["name"],
          },
        ],
        offset: 10,
        limit: 5,
        subQuery: false,
      },
      errors: [],
    });
  });
});
