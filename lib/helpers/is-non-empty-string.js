const isString = require("./is-string");

function isNonEmptyString(value) {
  return isString(value) && value.length > 0;
}

module.exports = isNonEmptyString;
