const isString = require('../helpers/is-string')

/**
 * Determines if a value is a MongoValueType.NUMBER.
 * According to this lib's "MongoDB-style" filtering conventions.
 * 
 * @param {string} value 
 * @returns true if the value looks like a NUMBER, otherwise, false
 * @see {@link MongoValueType}
 */
const isMongoNumber = (value) => {
    return isString(value) && !!value.trim().length && !isNaN(Number(value))
}

module.exports = isMongoNumber