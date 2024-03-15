const { Op } = require("sequelize");
const parse = require("../lib/parse");

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
        distinct: true,
        offset: 10,
        limit: 5,
        subQuery: false,
      },
      errors: [],
    });
  });
});
