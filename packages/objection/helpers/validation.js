function isNotValidInteger(number) {
  return !Number.isInteger(number) || number < 1;
}

function isAnArray(item) {
  return Array.isArray(item);
}

function isObject(val) {
  if (val === null || isAnArray(val)) {
    return false;
  }
  return typeof val === "function" || typeof val === "object";
}

function containsNoErrorFromParser(error) {
  return error.length === 0;
}

module.exports = {
  isAnArray,
  containsNoErrorFromParser,
  isNotValidInteger,
  isObject,
};
