const FilterStyle = require('../enums/filter-style')
const isString = require('./is-string')

const determineFilterStyle = (querystring) => {
    if (isString(querystring) && querystring.length) {
        const isMongoDB = querystring.includes('filter[')
        const isIBM = querystring.includes('filter=')

        if (isMongoDB && isIBM) {
            throw new Error('querystring should not include multiple filter styles')
        } else if (isMongoDB) {
            return FilterStyle.MONGO_DB
        } else if (isIBM) {
            return FilterStyle.IBM
        }
    }
}

module.exports = {
    determineFilterStyle
}