const {
  isNotValidInteger,
  containsNoErrorFromParser,
  isObject,
} = require("../helpers/validation");

function parsePagination(page, pageErrors) {
  const parsedResult = {};
  let errors = [];
  if (containsNoErrorFromParser(pageErrors)) {
    if (isObject(page)) {
      let { number, size } = page;
      if (number) {
        //default size to 10 if undefined
        size = size ?? 10;
        if (isNotValidInteger(number) || isNotValidInteger(size)) {
          errors.push("page[number] and page[size] should be integers");
        } else {
          const offset = getOffsetByPageNumber(number, size);
          parsedResult.offset = offset;
          parsedResult.limit = size;
        }
      }
    } else {
      errors.push("Page field should be an Object");
    }
  } else {
    errors = pageErrors;
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
