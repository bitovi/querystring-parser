//if it returns empty array when the include is empty
//fail if it isn't an array, so write a validation for array

function parseInclude(include) {
  const parsedArray = [];
  if (include.length > 0) {
    parsedArray.push({
      fx: "select",
      parameters: include,
    });
  }
  return parsedArray;
}

module.exports = parseInclude;
