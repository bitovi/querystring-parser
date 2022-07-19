const MongoValueType = require("../../lib/enums/mongo-value-type");
const areMongoTypesTheSame = require("../../lib/helpers/are-mongo-types-the-same");

describe("areMongoTypesTheSame", () => {
  /**
   * Should return the MongoValueType if they all match eachother (besides null)
   * Otherwise, should return false
   */
  const testCases = [
    // strings
    [MongoValueType.STRING, ["michael"]],
    [MongoValueType.STRING, ["michael", "brad"]],
    [MongoValueType.STRING, ["michael", "brad", "null"]],
    [MongoValueType.STRING, ["null", "michael"]],

    // numbers
    [MongoValueType.NUMBER, ["24"]],
    [MongoValueType.NUMBER, ["24", "25"]],
    [MongoValueType.NUMBER, ["24", "25", "null"]],
    [MongoValueType.NUMBER, ["null", "25"]],

    // dates
    [MongoValueType.DATE, ["2020-01-01"]],
    [MongoValueType.DATE, ["2020-01-01", "2021-01-01"]],
    [MongoValueType.DATE, ["2020-01-01", "2021-01-01", "null"]],
    [MongoValueType.DATE, ["null", "2021-01-01"]],

    // null
    [MongoValueType.NULL, ["null"]],

    // false
    [false, ["michael", "2020-01-02"]],
    [false, ["25", "2020-01-02"]],
    [false, ["michael", "25", "null"]],
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
