/** Determines if a value is a string. */
function isString (value) {
    return typeof value === 'string' || value instanceof String
}

module.exports = isString