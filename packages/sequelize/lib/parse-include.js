const {
  isAnArray,
  containsNoErrorFromParser,
} = require("../helpers/validation");

function parseInclude(include, includeErrors) {
  const parsedArray = {};
  let errors = [];
  if (containsNoErrorFromParser(includeErrors)) {
    if (isAnArray(include)) {
      if (include.length > 0) {
        parsedArray.include = include;
      }
    } else {
      errors.push("Include field should be an array");
    }
  } else {
    errors = includeErrors;
  }
  return {
    results: parsedArray,
    errors,
  };
}

module.exports = parseInclude;
