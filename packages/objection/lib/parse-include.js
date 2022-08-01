const {
  isAnArray,
  containsNoErrorFromParser,
} = require("../helpers/validation");

function parseInclude(include, includeErrors) {
  const parsedArray = [];
  let errors = [];
  if (containsNoErrorFromParser(includeErrors)) {
    if (!isAnArray(include)) {
      errors.push("Include field should be an array");
    } else {
      if (include.length > 0) {
        for (let param of include) {
          parsedArray.push({
            fx: "joinRelated",
            parameters: param,
          });
        }
      }
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
