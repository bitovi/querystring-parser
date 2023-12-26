function isValidInteger(number, min) {
  return Number.isInteger(number) && number >= min;
}

function isObject(val) {
  if (val === null || Array.isArray(val)) {
    return false;
  }
  return typeof val === "function" || typeof val === "object";
}

function removeHashFromString(str) {
  return str?.replace("#", "");
}

module.exports = {
  isValidInteger,
  isObject,
  removeHashFromString,
};
