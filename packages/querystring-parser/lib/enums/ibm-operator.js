/**
 * A enumeration of operators available for use in "IBM-style" query filters.
 * Examples: filter=equals(name,'michael')
 *           filter=greaterThan(age,'25)
 *           filter=or(not(equals(name,'brad')),any(age,24,25,26))
 */
const IbmOperator = Object.freeze({
  EQUALS: "equals",
  GREATER_THAN: "greaterThan",
  GREATER_OR_EQUAL: "greaterOrEqual",
  LESS_THAN: "lessThan",
  LESS_OR_EQUAL: "lessOrEqual",
  CONTAINS: "contains",
  STARTS_WITH: "startsWith",
  ENDS_WITH: "endsWith",
  ANY: "any",
  NOT: "not",
  AND: "and",
  OR: "or",
});

module.exports = IbmOperator;
