function isValidInteger(number) {
  return typeof number !== "number" || isNaN(number);
}

function isAnArray(item) {
  return Array.isArray(item);
}

function containsNoErrorFromParser(error, item) {
  return error[item]?.length === 0;
}

module.exports = {
  isAnArray,
  containsNoErrorFromParser,
  isValidInteger,
};
