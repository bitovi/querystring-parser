const MongoValueType = require("../enums/mongo-value-type")
const isMongoDate = require("./is-mongo-date")
const isMongoNull = require("./is-mongo-null")
const isMongoNumber = require("./is-mongo-number")

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
        if (isMongoNumber(val)) {
            return MongoValueType.NUMBER
        } else if (isMongoDate(val)) {
            return MongoValueType.DATE
        } else if (isMongoNull(val)) {
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