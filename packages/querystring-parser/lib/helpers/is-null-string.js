/** Determines if a value is a string representation of null. */
function isNullString(value) {
  return value === "null" || value === "\x00";
}

module.exports = isNullString;
