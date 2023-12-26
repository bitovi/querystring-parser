const { isValidInteger, isObject } = require("../helpers/validation");

function parsePagination(page, pageErrors) {
  const parsedResult = {};
  let errors = [];
  if (pageErrors.length) {
    errors = pageErrors;
  } else if (!isObject(page)) {
    errors.push("Page field should be an Object");
  } else {
    let { number, size, limit, offset } = page;

    if (limit != null || offset != null) {
      // default limit to 10 if undefined
      limit = limit ?? 10;
      if (!isValidInteger(offset, 0) || !isValidInteger(limit, 1)) {
        errors.push(
          "page[offset] should be non-negative integer and page[limit] should be positive integer",
        );
      } else {
        parsedResult.offset = offset;
        parsedResult.limit = limit;
        parsedResult.subQuery = false;
      }
    } else if (number != null) {
      // default size to 10 if undefined
      size = size ?? 10;
      if (!isValidInteger(number, 1) || !isValidInteger(size, 1)) {
        errors.push("page[number] and page[size] should be positive integers");
      } else {
        const offset = getOffsetByPageNumber(number, size);
        parsedResult.offset = offset;
        parsedResult.limit = size;
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
