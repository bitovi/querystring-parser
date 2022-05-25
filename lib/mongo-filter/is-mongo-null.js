/**
 * Determines if a value is a MongoValueType.NULL.
 * According to this lib's "MongoDB-style" filtering conventions.
 * 
 * @param {string} value 
 * @returns true if the value looks like a NULL, otherwise, false
 * @see {@link MongoValueType}
 */
const isMongoNull = (value) => {
    return value === 'null'
}

module.exports = isMongoNull