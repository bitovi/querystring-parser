/** Determines if a value is a boolean. */
function isBoolean(value) {
  return typeof value === "boolean" || value instanceof Boolean;
}

module.exports = isBoolean;
