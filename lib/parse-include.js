const qs = require('qs')

/**
 * JSON:API specifies a list of "relationship paths"
 * Objection expects a "RelationExpression"
 */

const parseInclude = (queryString) => {
  const { include: qsInclude } = qs.parse(queryString)
  const results = []
  const errors = []

  // TODO: maybe need to check if this is a nonempty string (for all of them)
  if (qsInclude) {
    results.push(...qsInclude.split(','))
  }

  return {
    results,
    errors
  }
}
module.exports = {
  parseInclude
}
