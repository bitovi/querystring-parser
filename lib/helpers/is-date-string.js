/** Determines if a value is a string representation of a date. */
function isDateString(value) {
    return /\d{4}-\d{2}-\d{2}/.test(value)
}

module.exports = isDateString