const isString = require('./is-string')

/** Determines if a value is a string representation of a number. */
const isNumberString = (value) => {
    return isString(value) && !!value.trim().length && !isNaN(Number(value))
}

module.exports = isNumberString