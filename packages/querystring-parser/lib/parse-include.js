const qs = require("qs");
const isNonEmptyString = require("./helpers/is-non-empty-string");

/**
 * JSON:API specifies a list of "relationship paths"
 * Objection expects a "RelationExpression"
 */

function parseInclude(querystring) {
  const { include: qsInclude } = qs.parse(querystring);
  const results = [];
  const errors = [];

  if (qsInclude) {
    results.push(...qsInclude.split(",").filter(isNonEmptyString));
  }

  return {
    results,
    errors,
  };
}

module.exports = parseInclude;
