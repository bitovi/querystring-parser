/**
 * An enumeration of value types available for use in "MongoDB-style" query filters.
 * Examples: filter[active]=true      -> boolean value
 *           filter[name]=michael     -> string value
 *           filter[age]=25           -> number value
 *           filter[born]=2020-01-01  -> date value
 *           filter[age]=null         -> null value
 *           filter[age][$in]=24,25   -> array of number values
 */
const MongoValueType = Object.freeze({
  BOOLEAN: Symbol("BOOLEAN"),
  STRING: Symbol("STRING"),
  NUMBER: Symbol("NUMBER"),
  DATE: Symbol("DATE"),
  NULL: Symbol("NULL"),
});

module.exports = MongoValueType;
