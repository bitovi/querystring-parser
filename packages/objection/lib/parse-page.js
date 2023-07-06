const {
  containsNoErrorFromParser,
  isNotValidInteger,
  isObject,
} = require("../helpers/validation");

function parsePagination(page, pageErrors) {
  const parsedArray = [];
  let errors = [];
  if (containsNoErrorFromParser(pageErrors)) {
    if (isObject(page)) {
      let { number, size } = page;
      if (number != null) {
        //default size to 10 if undefined
        size = size ?? 10;
        if (isNotValidInteger(number) || isNotValidInteger(size)) {
          errors.push(
            "page[number] and page[size] should be positive integers"
          );
        } else {
          const offset = getOffsetByPageNumber(number, size);
          parsedArray.push({
            fx: "offset",
            isNested: false,
            parameters: [offset],
          });
          parsedArray.push({
            fx: "limit",
            isNested: false,
            parameters: [size],
          });
        }
      }
    } else {
      errors.push("Page field should be an Object");
    }
  } else {
    errors = pageErrors;
  }
  return {
    results: parsedArray,
    errors,
  };
}

function getOffsetByPageNumber(number, size) {
  return (number - 1) * size;
}

module.exports = parsePagination;
