/** Determines if a value is a string representation of a boolean. */
function isBooleanString(value) {
  return ["true", "false"].includes(value);
}

module.exports = isBooleanString;
