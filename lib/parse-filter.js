const determineFilterStyle = require('./helpers/determine-filter-style')
const FilterStyle = require('./enums/filter-style')
const { parseMongoFilter } = require('./mongo-filter/parse-mongo-filter')
const { parseIbmFilter } = require('./ibm-filter/parse-ibm-filter')

const parseFilter = (queryString) => {
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

module.exports = {
  parseFilter,
}
