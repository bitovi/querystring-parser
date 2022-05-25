/**
 * Determines if a value is a Mongo.ValueType.DATE.
 * According to this lib's "MongoDB-style" filtering conventions.
 * 
 * @param {string} value 
 * @returns true if the value looks like a DATE, otherwise, false
 * @see {@link MongoValueType}
 */
const isMongoDate = (value) => {
    return /\d{4}-\d{2}-\d{2}/.test(value)
}

module.exports = isMongoDate