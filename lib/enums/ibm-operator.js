// TODO: explain - useful for well named progromatic handle on string literal
// TODO: describe domain significance
const MongoOperator = Object.freeze({
    EQUALS: '$eq',
    NOT_EQUALS: '$ne',
    GREATER_THAN: '$gt',
    GREATER_OR_EQUAL: '$gte',
    LESS_THAN: '$lt',
    LESS_OR_EQUAL: '$lte',
    ILIKE: '$ilike',
    IN: '$in',
    NOT_IN: '$nin',
})

module.exports = MongoOperator