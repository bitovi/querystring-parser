const qs = require('qs')

const parseSort = (queryString) => {
  const { sort: qsSort } = qs.parse(queryString)
  const results = []
  const errors = []

  // TODO: maybe need to check if this is a nonempty string
  if (qsSort) {
    qsSort.split(',').forEach(sortFieldExpression => {
      if (sortFieldExpression.startsWith('-')) {
        results.push({
          field: sortFieldExpression.substring(1),
          direction: 'DESC'
        })
      } else {
        results.push({
          field: sortFieldExpression,
          direction: 'ASC'
        })
      }
    })
  }

  return {
    results,
    errors
  }
}
module.exports = {
  parseSort
}
