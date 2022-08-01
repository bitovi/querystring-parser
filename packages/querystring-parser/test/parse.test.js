const parse = require("../lib/parse");

/** High level sanity tests */

describe("parse", function () {
  it("should return results for multiple query parameters (mongo filter)", function () {
    const querystring =
      "sort=-date,name&page[number]=1&page[size]=5&include=pets&fields[people]=name&filter[name]=jay";
    expect(parse(querystring)).toEqual({
      filter: {
        LIKE: ["#name", "%jay%"],
      },
      fields: {
        people: ["name"],
      },
      page: {
        number: 1,
        size: 5,
      },
      sort: [
        {
          field: "date",
          direction: "DESC",
        },
        {
          field: "name",
          direction: "ASC",
        },
      ],
      include: ["pets"],
      errors: {
        filter: [],
        fields: [],
        page: [],
        sort: [],
        include: [],
      },
    });
  });

  it("should return results for multiple query parameters (ibm filter)", function () {
    const querystring =
      "sort=-date,name&page[number]=1&page[size]=5&include=pets&fields[people]=name&filter=contains(name,'jay')";
    expect(parse(querystring)).toEqual({
      filter: {
        LIKE: ["#name", "%jay%"],
      },
      fields: {
        people: ["name"],
      },
      page: {
        number: 1,
        size: 5,
      },
      sort: [
        {
          field: "date",
          direction: "DESC",
        },
        {
          field: "name",
          direction: "ASC",
        },
      ],
      include: ["pets"],
      errors: {
        filter: [],
        fields: [],
        page: [],
        sort: [],
        include: [],
      },
    });
  });
});
