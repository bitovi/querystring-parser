const { containsNoErrorFromParser } = require("../helpers/validation");

function parseField(field, fieldErrors) {
  const parsedArray = [];
  let errors = [];
  if (containsNoErrorFromParser(fieldErrors)) {
    const keys = Object.keys(field);
    if (keys.length <= 0) {
      errors.push("Fields field should be an object");
    } else {
      if (field.length > 0) {
        parsedArray.push({
          fx: "select",
          parameters: field,
        });
      }
    }
  } else {
    errors = fieldErrors;
  }
  return {
    results: parsedArray,
    errors,
  };
}

module.exports = parseField;
