/** A enumeration of SQL operators for parsing querystring filters. */
const SqlOperator = Object.freeze({
  EQUALS: "=",
  NOT_EQUALS: "<>",
  GREATER_THAN: ">",
  GREATER_OR_EQUAL: ">=",
  LESS_THAN: "<",
  LESS_OR_EQUAL: "<=",
  ILIKE: "ILIKE",
  LIKE: "LIKE",
  IN: "IN",
  NOT_IN: "NOT IN",
  NOT: "NOT",
  AND: "AND",
  OR: "OR",
  IS_NULL: "IS NULL",
  IS_NOT_NULL: "IS NOT NULL",
});

module.exports = SqlOperator;
