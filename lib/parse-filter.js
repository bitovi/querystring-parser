const determineFilterStyle = require('./helpers/determine-filter-style')
const FilterStyle = require('./enums/filter-style')
const parseMongoFilter = require('./filter-styles/parse-mongo-filter')
const parseIbmFilter = require('./filter-styles/parse-ibm-filter')

function parseFilter(queryString) {
  let results
  const errors = []
  let style

  try {
    style = determineFilterStyle(queryString)
  } catch (e) {
    errors.push(e)
  }

  if (style) {
    const parserMap = {
      [FilterStyle.MONGO_DB]: parseMongoFilter,
      [FilterStyle.IBM]: parseIbmFilter,
    }
    const styleParserReturn = parserMap[style](queryString)
    results = styleParserReturn.results
    errors.push(...styleParserReturn.errors)
  }

  return { results, errors }
}

module.exports = parseFilter
