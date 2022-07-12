const { Op } = require("sequelize");
const {
  containsNoErrorFromParser,
  isObject,
} = require("../helpers/validation");

const SequelizeSymbols = {
  LIKE: Op.like,
  OR: Op.or,
  AND: Op.and,
  NOT: Op.not,
  "=": Op.eq,
  ">": Op.gt,
  ">=": Op.gte,
  "<": Op.lt,
  "<=": Op.lte,
  IN: Op.in,
};

function parseParametersForSequelize(operator, value) {
  return Array.isArray(value)
    ? {
        [value[0]]: {
          [SequelizeSymbols[operator]]:
            value.length > 2 ? value.slice(1) : value[1],
        },
      }
    : [value, operator];
}

function sortArrayFilters(filters) {
  let parsedArray = [];
  for (let filter of filters) {
    parsedArray.push(parseFilters(filter, [], false).results);
  }
  return parsedArray;
}

function parseFilters(filters, filtersError, isDefault = true) {
  let parsedResult = {};
  let errors = [];
  let isValidFilters = false; //check if any processing is done to filter data
  if (containsNoErrorFromParser(filtersError)) {
    if (isObject(filters)) {
      const keys = Object.keys(filters);
      if (keys.length > 0) isValidFilters = true;
      for (let key of keys) {
        if (key === "AND" || key === "OR") {
          parsedResult[SequelizeSymbols[key]] = sortArrayFilters(filters[key]);
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

console.log(
  parseFilters(
    { OR: [{ IN: ["#age", 10, 20] }, { "=": ["#name", "mike"] }] },
    []
  )
);

module.exports = parseFilters;
