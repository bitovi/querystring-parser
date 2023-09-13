const {
  isAnArray,
  containsNoErrorFromParser,
} = require("../helpers/validation");

function parseSort(sort, sortErrors) {
  const parsedArray = [];
  let errors = [];
  if (!containsNoErrorFromParser(sortErrors)) {
    errors = sortErrors;
  } else if (!isAnArray(sort)) {
    errors.push("Sort field should be an array");
  } else if (sort.length > 0) {
    const newSortFields = sort.map((field) => {
      return {
        column: field.field,
        order: field.direction,
      };
    });
    parsedArray.push({
      fx: "orderBy",
      isNested: false,
      parameters: [newSortFields],
    });
  }

  return {
    results: parsedArray,
    errors,
  };
}

module.exports = parseSort;
