const determineFilterStyle = require("./helpers/determine-filter-style");
const FilterStyle = require("./enums/filter-style");
const parseMongoFilter = require("./filter-styles/parse-mongo-filter");
const parseIbmFilter = require("./filter-styles/parse-ibm-filter");
const QuerystringParsingError = require("./errors/querystring-parsing-error");

function parseFilter(querystring) {
  let results;
  const errors = [];
  let style;

  try {
    style = determineFilterStyle(querystring);
    if (style === undefined) {
      throw new QuerystringParsingError({
        message: "querystring filter did not match any of the supported styles",
        querystring,
      });
    }
  } catch (e) {
    errors.push(e);
  }

  if (style) {
    const parserMap = {
      [FilterStyle.MONGO_DB]: parseMongoFilter,
      [FilterStyle.IBM]: parseIbmFilter,
    };
    const styleParserReturn = parserMap[style](querystring);
    results = styleParserReturn.results;
    errors.push(...styleParserReturn.errors);
  }

  return { results, errors };
}

module.exports = parseFilter;
