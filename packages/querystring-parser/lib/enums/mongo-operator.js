/**
 * A enumeration of operators available for use in "MongoDB-style" query filters.
 * Examples: filter[name][$eq]=michael
 *           filter[born][$lte]=2020-01-01
 *
 * The MongoOperator.IS_NULL operator is a logical convenience, not usable in querystring.
 */
const MongoOperator = Object.freeze({
  EQUALS: "$eq",
  NOT_EQUALS: "$ne",
  GREATER_THAN: "$gt",
  GREATER_OR_EQUAL: "$gte",
  LESS_THAN: "$lt",
  LESS_OR_EQUAL: "$lte",
  IN: "$in",
  NOT_IN: "$nin",
  LIKE: "$like",
  ILIKE: "$ilike",
  IS_NULL: Symbol(), // lib internal
});

module.exports = MongoOperator;
