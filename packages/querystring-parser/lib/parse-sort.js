const qs = require("qs");
const isNonEmptyString = require("./helpers/is-non-empty-string");

function parseSort(querystring) {
  const { sort: qsSort } = qs.parse(querystring);
  const results = [];
  const errors = [];

  if (qsSort) {
    qsSort
      .split(",")
      .filter(isNonEmptyString)
      .forEach((sortFieldExpression) => {
        if (sortFieldExpression.startsWith("-")) {
          results.push({
            field: sortFieldExpression.substring(1),
            direction: "DESC",
          });
        } else {
          results.push({
            field: sortFieldExpression,
            direction: "ASC",
          });
        }
      });
  }

  return {
    results,
    errors,
  };
}
module.exports = parseSort;
