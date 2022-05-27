// TODO: explain - useful for well named progromatic handle on string literal
// TODO: describe domain significance
const MongoOperator = Object.freeze({
    EQUALS: 'equals',
    GREATER_THAN: 'greaterThan',
    GREATER_OR_EQUAL: 'greaterOrEqual',
    LESS_THAN: 'lessThan',
    LESS_OR_EQUAL: 'lessOrEqual',
    CONTAINS: 'contains',
    STARTS_WITH: 'startsWith',
    ENDS_WITH: 'endsWith',
    ANY: 'any',
    NOT: 'not',
    AND: 'and',
    OR: 'or',
})

module.exports = MongoOperator