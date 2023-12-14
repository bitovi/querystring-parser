const { isNotValidInteger, isObject } = require("../helpers/validation");

function parsePagination(page, pageErrors) {
  const parsedResult = {};
  let errors = [];
  if (pageErrors.length) {
    errors = pageErrors;
  } else if (!isObject(page)) {
    errors.push("Page field should be an Object");
  } else {
    let { number, size, limit, offset } = page;
    if (number != null) {
      // default size to 10 if undefined
      size = size ?? 10;
      if (isNotValidInteger(number) || isNotValidInteger(size)) {
        errors.push("page[number] and page[size] should be positive integers");
      } else {
        const offset = getOffsetByPageNumber(number, size);
        parsedResult.offset = offset;
        parsedResult.limit = size;
        parsedResult.subQuery = false;
      }
    }
    if (limit != null || offset != null) {
      // default limit to 10 if undefined
      limit = limit ?? 10;
      if (isNotValidInteger(offset) || isNotValidInteger(limit)) {
        errors.push("page[offset] and page[limit] should be positive integers");
      } else {
        parsedResult.offset = offset;
        parsedResult.limit = limit;
        parsedResult.subQuery = false;
      }
    }
  }

  return {
    results: parsedResult,
    errors,
  };
}

function getOffsetByPageNumber(number, size) {
  return (number - 1) * size;
}

module.exports = parsePagination;
