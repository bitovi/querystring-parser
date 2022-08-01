const {
  containsNoErrorFromParser,
  isAnArray,
} = require("../helpers/validation");

function parseSort(sort, sortError) {
  const parsedResult = {};
  let errors = [];
  if (containsNoErrorFromParser(sortError)) {
    if (!isAnArray(sort)) {
      errors.push("Sort field should be an array");
    } else {
      if (sort.length > 0) {
        const newSortFields = sort.map((field) => [
          field.field,
          field.direction,
        ]);
        parsedResult.order = newSortFields;
      }
    }
  } else {
    errors = sortError;
  }
  return {
    results: parsedResult,
    errors,
  };
}

module.exports = parseSort;
