const MongoValueType = require("../enums/mongo-value-type")
const isDateString = require("../helpers/is-date-string")
const isNullString = require("../helpers/is-null-string")
const isNumberString = require("../helpers/is-number-string")

/**
 * Determines if all values in an array have the same {@link MongoValueType}.
 * If so, returns the {@link MongoValueType}, otherwise, returns false.
 * 
 * 
 * @param {string[]} values - an array of string values
 * @returns either the {@link MongoValueType} or false.
 * @see {@link MongoValueType}
 */
const areMongoTypesTheSame = (values) => {
    const types = values.map(val => {
        if (isNumberString(val)) {
            return MongoValueType.NUMBER
        } else if (isDateString(val)) {
            return MongoValueType.DATE
        } else if (isNullString(val)) {
            return MongoValueType.NULL
        } else {
            return MongoValueType.STRING
        }
      })

      const allNull = types.every(type => type === MongoValueType.NULL)
      if (allNull) {
            return MongoValueType.NULL
      } else {
        const allSameOrNull = types.filter(type => type !== MongoValueType.NULL)
          .every((type, index, array) => type === array[0])
  
        return allSameOrNull ? types.find(type => type !== MongoValueType.NULL) : false
      }
}

module.exports = areMongoTypesTheSame