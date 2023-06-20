const MongoValueType = require("../enums/mongo-value-type");
const isBooleanString = require("./is-boolean-string");
const isDateString = require("./is-date-string");
const isNullString = require("./is-null-string");
const isNumberString = require("./is-number-string");

/**
 * Determines if all values in an array represent the same {@link MongoValueType}.
 * If so, returns the {@link MongoValueType}, otherwise, returns false.
 *
 * @param {string[]} values - an array of string values
 * @returns either the {@link MongoValueType} or false.
 * @see {@link MongoValueType}
 */
function areMongoTypesTheSame(values) {
  const types = values.map((val) => {
    if (isBooleanString(val)) return MongoValueType.BOOLEAN;
    if (isNumberString(val)) return MongoValueType.NUMBER;
    if (isDateString(val)) return MongoValueType.DATE;
    if (isNullString(val)) return MongoValueType.NULL;
    return MongoValueType.STRING;
  });

  const allNull = types.every((type) => type === MongoValueType.NULL);
  if (allNull) {
    return MongoValueType.NULL;
  } else {
    const allSameOrNull = types
      .filter((type) => type !== MongoValueType.NULL)
      .every((type, index, array) => type === array[0]);

    return allSameOrNull
      ? types.find((type) => type !== MongoValueType.NULL)
      : false;
  }
}

module.exports = areMongoTypesTheSame;
