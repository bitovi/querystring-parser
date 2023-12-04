const qs = require("qs");
const isNonEmptyString = require("./helpers/is-non-empty-string");

const QuerystringParsingError = require("./errors/querystring-parsing-error");

function parseFields(querystring) {
  const params = qs.parse(querystring, { depth: 0, comma: true });

  return Object.entries(params).reduce(
    (acc, [key, value]) => {
      if (!key.startsWith("fields")) return acc;

      // force array of values for simple logic
      let values = Array.isArray(value) ? value : [value];

      if (!key.match(/^fields\[(.*?)\]$/)) {
        return {
          ...acc,
          errors: [
            ...acc.errors,
            new QuerystringParsingError({
              message: "Incorrect format was provided for fields.",
              querystring,
              paramKey: key,
              paramValue: values,
            }),
          ],
        };
      }

      // remove duplicates
      values = [...new Set(values)];

      // skip empty string values
      values = values.filter(isNonEmptyString);

      if (!values.length) return acc;

      return {
        ...acc,
        results: {
          ...acc.results,
          [getType(key)]: values,
        },
      };
    },
    { results: {}, errors: [] },
  );
}

/** Extracts the type from a fields query parameter. E.g. "cat" from "fields[cat]" */
function getType(param) {
  const lBracket = param.indexOf("[");
  const rBracket = param.indexOf("]");
  if (lBracket !== -1 && rBracket !== -1) {
    return param.slice(lBracket + 1, rBracket);
  }
}

module.exports = parseFields;
