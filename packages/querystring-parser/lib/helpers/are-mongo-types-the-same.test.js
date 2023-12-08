const MongoValueType = require("../../lib/enums/mongo-value-type");
const areMongoTypesTheSame = require("./are-mongo-types-the-same");

describe("areMongoTypesTheSame", () => {
  /**
   * Should return the MongoValueType if they all match each other (besides null)
   * Otherwise, should return false
   */
  const testCases = [
    // booleans
    [MongoValueType.BOOLEAN, ["true"]],
    [MongoValueType.BOOLEAN, ["true", "false"]],
    [MongoValueType.BOOLEAN, ["true", "false", "\x00"]],
    [MongoValueType.BOOLEAN, ["\x00", "true"]],

    // strings
    [MongoValueType.STRING, ["michael"]],
    [MongoValueType.STRING, ["michael", "brad"]],
    [MongoValueType.STRING, ["michael", "brad", "\x00"]],
    [MongoValueType.STRING, ["\x00", "michael"]],

    // numbers
    [MongoValueType.NUMBER, ["24"]],
    [MongoValueType.NUMBER, ["24", "25"]],
    [MongoValueType.NUMBER, ["24", "25", "\x00"]],
    [MongoValueType.NUMBER, ["\x00", "25"]],

    // dates
    [MongoValueType.DATE, ["2020-01-01"]],
    [MongoValueType.DATE, ["2020-01-01", "2021-01-01"]],
    [MongoValueType.DATE, ["2020-01-01", "2021-01-01", "\x00"]],
    [MongoValueType.DATE, ["\x00", "2021-01-01"]],

    // null
    [MongoValueType.NULL, ["\x00"]],

    // false
    [false, ["true", "2020-01-02"]],
    [false, ["michael", "2020-01-02"]],
    [false, ["25", "2020-01-02"]],
    [false, ["michael", "25", "\x00"]],
  ].map(([expected, input]) => {
    const prettyInput = JSON.stringify(input);
    const prettyExpected = expected ? expected.toString() : expected;
    return {
      expected,
      input,
      title: `${prettyInput} should return ${prettyExpected}`,
    };
  });

  test.concurrent.each(testCases)("$title", ({ expected, input }) => {
    expect(areMongoTypesTheSame(input)).toBe(expected);
  });
});
