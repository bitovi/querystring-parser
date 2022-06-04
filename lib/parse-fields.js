const qs = require("qs");
const isNonEmptyString = require("./helpers/is-non-empty-string");

const QuerystringParsingError = require("./errors/querystring-parsing-error");

function parseFields(querystring) {
  const results = {};
  const errors = [];

  let params = qs.parse(querystring, { depth: 0, comma: true });
  params = Object.entries(params).filter(([key]) => key.startsWith("fields"));

  for (const [key, value] of params) {
    // force array of values for simple logic
    let values = Array.isArray(value) ? value : [value];

    // remove duplicates
    values = values.reduce(removeDuplicatesReducer, []);

    // skip empty string values
    values = values.filter(isNonEmptyString);
    if (values.length === 0) {
      continue;
    }

    const type = getType(key);
    if (!isNonEmptyString(type)) {
      errors.push(
        new QuerystringParsingError({
          message: "Incorrect format was provided for fields.",
          querystring,
          paramKey: key,
          paramValue: values,
        })
      );
      continue;
    }

    results[type] = values;
  }

  return { results, errors };
}

/** Extracts the type from a fields query parameter. E.g. "cat" from "fields[cat]" */
function getType(param) {
  const lBracket = param.indexOf("[");
  const rBracket = param.indexOf("]");
  if (lBracket !== -1 && rBracket !== -1) {
    return param.slice(lBracket + 1, rBracket);
  }
}

function removeDuplicatesReducer(accumulator, currentValue) {
  if (!accumulator.includes(currentValue)) {
    accumulator.push(currentValue);
  }
  return accumulator;
}

module.exports = parseFields;
