const qs = require("qs");

/**
 * JSON:API specifies a list of "relationship paths"
 * Objection expects a "RelationExpression"
 */

function parseInclude(querystring) {
  const { include: qsInclude } = qs.parse(querystring);
  const results = [];
  const errors = [];

  // TODO: maybe need to check if this is a nonempty string (for all of them)
  if (qsInclude) {
    results.push(...qsInclude.split(","));
  }

  return {
    results,
    errors,
  };
}

module.exports = parseInclude;
