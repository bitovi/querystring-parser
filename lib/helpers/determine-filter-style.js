const FilterStyle = require("../enums/filter-style");
const isString = require("./is-string");
const QuerystringParsingError = require("../errors/querystring-parsing-error");

/** Determines which filter style a querystring employs */
function determineFilterStyle(querystring) {
  if (isString(querystring) && querystring.length) {
    const isMongoDB = querystring.includes("filter[");
    const isIBM = querystring.includes("filter=");

    if (isMongoDB && isIBM) {
      throw new QuerystringParsingError({
        message: "querystring should not include multiple filter styles",
        querystring,
      });
    } else if (isMongoDB) {
      return FilterStyle.MONGO_DB;
    } else if (isIBM) {
      return FilterStyle.IBM;
    }
  }
}

module.exports = determineFilterStyle;
