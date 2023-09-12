const {
  containsNoErrorFromParser,
  isObject,
} = require("../helpers/validation");

function parseField(field, fieldErrors) {
  const parsedArray = [];
  let errors = [];
  if (!containsNoErrorFromParser(fieldErrors)) {
    errors = fieldErrors;
  } else if (!isObject(field)) {
    errors.push("Fields field should be an object");
  } else {
    const keys = Object.keys(field);
    if (keys.length > 0) {
      const parameters = field[keys[0]];
      parsedArray.push({
        fx: "select",
        isNested: false,
        parameters,
      });
    }
  }

  return {
    results: parsedArray,
    errors,
  };
}

module.exports = parseField;
