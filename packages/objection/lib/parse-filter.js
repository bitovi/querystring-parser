const {
  isAnArray,
  containsNoErrorFromParser,
  isObject,
} = require("../helpers/validation");

//To reconstruct the parameters to objections format
function parseParametersForObjection(operator, value) {
  return Array.isArray(value)
    ? value.length > 2
      ? [value[0], operator, value.slice(1)]
      : [value[0], operator, value[1]]
    : [value, operator];
}

//To handle "OR" AND "AND" recursively
function sortArrayFilters(filters, isOr = false) {
  let i = 0;
  let parsedArray = [];
  let errors = [];
  for (let filter of filters) {
    //use the orWhere only on from the second iteration.
    let useOr = isOr && i > 0;
    const parseFilterResponse = parseFilters(filter, [], useOr);
    parsedArray = [...parsedArray, ...parseFilterResponse.results];
    errors = [...errors, ...parseFilterResponse.errors];
    i++;
  }
  return parsedArray;
}

function parseFilters(filters, filterErrors, isOr = false) {
  let parsedArray = [];
  let errors = [];
  if (containsNoErrorFromParser(filterErrors)) {
    if (isObject(filters)) {
      const keys = Object.keys(filters);
      if (keys.length > 0) {
        for (let key of keys) {
          if (key === "AND" || key === "OR") {
            if (isAnArray(filters[key])) {
              parsedArray = [
                ...parsedArray,
                ...sortArrayFilters(filters[key], key === "OR"),
              ];
            } else {
              errors.push(`${filters[key]} should be an array`);
            }
          } else {
            const parameters = parseParametersForObjection(key, filters[key]);
            parsedArray.push({
              fx: isOr ? "orWhere" : "where",
              parameters,
            });
          }
        }
      }
    } else {
      errors.push("Filter field must be an object");
    }
  } else {
    errors = filterErrors;
  }
  return {
    results: parsedArray,
    errors,
  };
}

module.exports = parseFilters;
