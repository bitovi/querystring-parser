const isString = require('../helpers/is-string')

// TODO doc and explain this 
const isMongoNumber = (value) => {
    return isString(value) && !!value.trim().length && !isNaN(Number(value))
}

module.exports = isMongoNumber