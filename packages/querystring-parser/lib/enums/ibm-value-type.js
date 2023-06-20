/**
 * An enumeration of value types available for use in "IBM-style" query filters.
 * Examples: equals(name,'true')          -> boolean value
 *           equals(name,'michael')     -> string value
 *           equals(age,'25')           -> number value
 *           equals(born,'2020-01-01')  -> date value
 *           equals(wins,losses)        -> attribute reference
 *           equals(age,null)           -> null value
 */
const IbmValueType = Object.freeze({
  BOOLEAN: Symbol("BOOLEAN"),
  STRING: Symbol("STRING"),
  NUMBER: Symbol("NUMBER"),
  DATE: Symbol("DATE"),
  ATTRIBUTE_REF: Symbol("ATTRIBUTE_REF"),
  NULL: Symbol("NULL"),
});

module.exports = IbmValueType;
