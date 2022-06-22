const FilterStyle = require("../enums/filter-style");
const isString = require("./is-string");
const QuerystringParsingError = require("../errors/querystring-parsing-error");
const IbmOperator = require("../enums/ibm-operator");

/**
 * Determines which filter style a querystring employs.
 * @param {*} querystring
 * @returns the filter style or undefined if it can not be determined.
 * @throws {QuerystringParsingError} if multiple styles detected.
 */
function determineFilterStyle(querystring) {
  querystring = decodeURI(querystring);
  if (isString(querystring) && querystring.length) {
    const isMongoDB = querystring.includes("filter[");
    const isIBM =
      querystring.includes("filter=") &&
      Object.values(IbmOperator).some((op) => querystring.includes(op));

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
