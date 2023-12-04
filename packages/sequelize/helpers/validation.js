function isNotValidInteger(number) {
  return !Number.isInteger(number) || number < 1;
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
  isNotValidInteger,
  isObject,
  removeHashFromString,
};
