/**
 * TODO - Document
 */
class QuerystringParsingError extends Error {
  constructor({ message, querystring, paramKey, paramValue }) {
    super(message);
    this.querystring = querystring;
    this.paramKey = paramKey;
    this.paramValue = paramValue;
    this.name = "QuerystringParsingError";
  }
}

module.exports = QuerystringParsingError;
