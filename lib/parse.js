const { parseFilter } = require('./parse-filter')
const { parseFields } = require('./parse-fields')
const { parsePage } = require('./parse-page')
const { parseSort } = require('./parse-sort')
const { parseInclude } = require('./parse-include')

const parse = (queryString) => {
  const filter = parseFilter(queryString)
  const fields = parseFields(queryString)
  const page = parsePage(queryString)
  const sort = parseSort(queryString)
  const include = parseInclude(queryString)

  return {
    filter: filter.results,
    fields: fields.results,
    page: page.results,
    sort: sort.results,
    include: include.results,
    errors: {
      filter: filter.errors,
      fields: fields.errors,
      page: page.errors,
      sort: sort.errors,
      include: include.errors
    }
  }
}

module.exports = {
  parse
}