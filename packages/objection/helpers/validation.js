function isNotValidInteger(number) {
  return !Number.isInteger(number) || number < 1;
}

function isObject(val) {
  if (val === null || Array.isArray(val)) {
    return false;
  }
  return typeof val === "function" || typeof val === "object";
}

module.exports = {
  isNotValidInteger,
  isObject,
};
