function isNotValidInteger(number) {
  return typeof number !== "number" || isNaN(number);
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

function removeHashFromString(str) {
  return str?.replace("#", "");
}

module.exports = {
  isAnArray,
  containsNoErrorFromParser,
  isNotValidInteger,
  isObject,
  removeHashFromString,
};
