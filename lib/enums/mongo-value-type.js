// TODO: explain - useful for well named progromatic handle on string literal
// TODO: describe domain significance
const MongoValueType = Object.freeze({
    STRING: Symbol('STRING'),
    NUMBER: Symbol('NUMBER'),
    DATE: Symbol('DATE'),
    NULL: Symbol('NULL')
})

module.exports = MongoValueType