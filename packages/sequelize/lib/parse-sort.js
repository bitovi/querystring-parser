const {
  containsNoErrorFromParser,
  isAnArray,
} = require("../helpers/validation");

function parseSort(sort, sortError) {
  const parsedResult = {};
  let errors = [];
  if (!containsNoErrorFromParser(sortError)) {
    errors = sortError;
  } else if (!isAnArray(sort)) {
    errors.push("Sort field should be an array");
  } else if (sort.length > 0) {
    const newSortFields = sort.map((field) => [field.field, field.direction]);
    parsedResult.order = newSortFields;
  }

  return {
    results: parsedResult,
    errors,
  };
}

module.exports = parseSort;
