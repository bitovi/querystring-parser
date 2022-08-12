const { Op } = require("sequelize");
const {
  containsNoErrorFromParser,
  isObject,
  removeHashFromString,
} = require("../helpers/validation");

const SequelizeSymbols = {
  LIKE: Op.like,
  OR: Op.or,
  AND: Op.and,
  NOT: Op.not,
  "=": Op.eq,
  "!=": Op.ne,
  ">": Op.gt,
  ">=": Op.gte,
  "<": Op.lt,
  "<=": Op.lte,
  IN: Op.in,
};

function parseParametersForSequelize(operator, value) {
  let key = removeHashFromString(value[0]);
  return Array.isArray(value)
    ? {
        [key]: {
          [SequelizeSymbols[operator]]:
            value.length > 2 ? value.slice(1) : value[1],
        },
      }
    : [value, operator];
}

function sortArrayFilters(filters) {
  let parsedArray = [];
  let errors = [];

  // wrap NOT sub-expressions (which are singular objects) in an array
  filters = Array.isArray(filters) ? filters : [filters];

  for (let filter of filters) {
    const parsedFiltersResult = parseFilters(filter, [], false);
    parsedArray.push(parsedFiltersResult.results);
    errors.push(parsedFiltersResult.errors);
  }
  return parsedArray;
}

function parseFilters(filters, filtersError, isDefault = true) {
  let parsedResult = {};
  let errors = [];
  let isValidFilters = false; //check if any processing is done to filter data
  if (filters) {
    if (containsNoErrorFromParser(filtersError)) {
      if (isObject(filters)) {
        const keys = Object.keys(filters);
        if (keys.length > 0) isValidFilters = true;
        for (let key of keys) {
          // Handle operators with sub-expressions recursively
          if (key === "AND" || key === "OR" || key === "NOT") {
            parsedResult[SequelizeSymbols[key]] = sortArrayFilters(
              filters[key]
            );
          } else {
            const parsedKey = parseParametersForSequelize(key, filters[key]);
            parsedResult = { ...parsedResult, ...parsedKey };
          }
        }
      } else {
        errors.push("Filter field must be an object");
      }
    } else {
      errors = filtersError;
    }
  }
  const results =
    isValidFilters && isDefault
      ? {
          where: parsedResult,
        }
      : parsedResult;
  return {
    results,
    errors,
  };
}

module.exports = parseFilters;
