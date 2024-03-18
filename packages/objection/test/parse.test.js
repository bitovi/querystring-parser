const QuerystringParsingError = require("@bitovi/querystring-parser/lib/errors/querystring-parsing-error");
const parse = require("../lib/parse");

describe("parse", () => {
  it("combines all parsers", () => {
    expect(
      parse(
        "include=user&filter=equals(name,'laundry')&fields[]=id,name,dueDate&fields[user]=name&page[number]=3&page[size]=5",
      ),
    ).toEqual({
      orm: "objection",
      data: [
        {
          fx: "select",
          isNested: false,
          parameters: ["id", "name", "dueDate"],
        },
        { fx: "where", isNested: false, parameters: ["name", "=", "laundry"] },
        { fx: "withGraphFetched", isNested: false, parameters: ["user"] },
        { fx: "offset", isNested: false, parameters: [10] },
        { fx: "limit", isNested: false, parameters: [5] },
      ],
      errors: [],
    });
  });

  it("handles filter errors", () => {
    expect(parse("filter[name]=mongo&filter=equals(name,'ibm')")).toEqual({
      orm: "objection",
      data: [],
      errors: [
        new QuerystringParsingError({
          message: "querystring should not include multiple filter styles",
          querystring: "filter[name]=mongo&filter=equals(name,'ibm')",
        }),
      ],
    });
  });
});
