function isValidInteger(number) {
  return typeof number !== "number" || isNaN(number);
}

function isAnArray(item) {
  return Array.isArray(item);
}

function containsNoErrorFromParser(error) {
  return error.length === 0;
}

module.exports = {
  isAnArray,
  containsNoErrorFromParser,
  isValidInteger,
};
