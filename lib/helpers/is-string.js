const isString = (value) => {
    return typeof value === 'string' || value instanceof String
}

module.exports = isString