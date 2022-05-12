const qs = require('qs')

const parseFilter = (queryString) => {
  const { filter } = qs.parse(queryString)
  const comparisonObjects = []

  if (filter) {
    for (const [key, value] of Object.entries(filter)) {
      const isNum = !isNaN(Number(value))
      const isDate = !isNaN(Date.parse(value))
      const isEqual = isNum || isDate
      let comparator = 'ilike' // default
      let sqlValue = value

      // check for explicit comparator
      // TODO improve to catch typos/unsupported comparators
      if (typeof value === 'object') {
        comparator = Object.keys(value)[0] // should only be one key?
        sqlValue = value[comparator]
      }

      // comparator conversion
      comparator = {
        // mongodb comparators -> objection comparators
        $eq: '=',
        $ne: '!=',
        $gt: '>',
        $gte: '>=',
        $lt: '<',
        $lte: '<=',
        // TODO: add when array values are supported
        // $in: '',
        // $nin: '',
        // objection comparators -> objection comparators
        ilike: 'ilike'
      }[comparator] || comparator

      // default to "=" for dates and numbers (instead of ilike)
      if (isEqual && comparator === 'ilike') {
        comparator = '='
      }

      // surround value with wildcards in the case of ilike
      if (comparator === 'ilike') {
        sqlValue = `%${sqlValue}%`
      }

      comparisonObjects.push({ field: key, comparator, value: sqlValue })
    }
  }

  return {
    results: comparisonObjects,
    errors: []
  }
}

module.exports = {
  parseFilter
}
