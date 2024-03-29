const { Op } = require("sequelize");
const { isObject, removeHashFromString } = require("../helpers/validation");

const Operator = Object.freeze({
  EQUALS: "=",
  NOT_EQUALS: "<>",
  GREATER_THAN: ">",
  GREATER_OR_EQUAL: ">=",
  LESS_THAN: "<",
  LESS_OR_EQUAL: "<=",
  LIKE: "LIKE",
  ILIKE: "ILIKE",
  IN: "IN",
  NOT_IN: "NOT IN",
  NOT: "NOT",
  AND: "AND",
  OR: "OR",
  IS_NULL: "IS NULL",
  IS_NOT_NULL: "IS NOT NULL",
  ANY: "ANY",
});

const SequelizeSymbols = Object.freeze({
  [Operator.OR]: Op.or,
  [Operator.AND]: Op.and,
  [Operator.NOT]: Op.not,
  [Operator.NOT_IN]: Op.notIn,
  [Operator.IN]: Op.in,
  [Operator.LIKE]: Op.like,
  [Operator.ILIKE]: Op.iLike,
  [Operator.EQUALS]: Op.eq,
  [Operator.NOT_EQUALS]: Op.ne,
  [Operator.GREATER_THAN]: Op.gt,
  [Operator.GREATER_OR_EQUAL]: Op.gte,
  [Operator.LESS_THAN]: Op.lt,
  [Operator.LESS_OR_EQUAL]: Op.lte,
  [Operator.ANY]: Op.any,
});

function parseParametersForSequelize(operator, value) {
  let sequelizeKey, sequelizeOperator, sequelizeValue;
  const specialOperators = [Operator.IN, Operator.NOT_IN, Operator.NOT];
  const isArray = Array.isArray(value);
  const isSpecialOperator = specialOperators.some(
    (op) => op.toLocaleLowerCase() === operator.toLocaleLowerCase(),
  );
  //ALL NON-ARRAYS ARE FOR NULL HANDLERS
  if (isArray) {
    sequelizeKey = removeHashFromString(value[0]);
    sequelizeOperator = SequelizeSymbols[operator];
    sequelizeValue =
      value.length > 2 || isSpecialOperator ? value.slice(1) : value[1];
  } else {
    sequelizeKey = removeHashFromString(value);
    sequelizeOperator =
      operator === Operator.IS_NULL
        ? SequelizeSymbols[Operator.EQUALS]
        : SequelizeSymbols[Operator.NOT_EQUALS];
    sequelizeValue = null;
  }
  return {
    [sequelizeKey]: {
      [sequelizeOperator]: sequelizeValue,
    },
  };
}

function sortArrayFilters(filters) {
  // wrap NOT sub-expressions (which are singular objects) in an array
  const { parsedArray } = (Array.isArray(filters) ? filters : [filters]).reduce(
    (acc, filter) => {
      const { results, errors } = parseFilters(filter, [], false);

      return {
        acc,
        parsedArray: [...acc.parsedArray, results],
        errors: [...acc.errors, errors],
      };
    },
    { parsedArray: [], errors: [] },
  );
  return parsedArray;
}

function parseFilters(filters, filtersError, isDefault = true) {
  let parsedResult = {};
  let errors = [];
  let isValidFilters; // check if any processing is done to filter data
  if (filtersError.length) {
    errors = filtersError;
  } else if (filters) {
    if (!isObject(filters)) {
      errors.push("Filter field must be an object");
    } else {
      const keys = Object.keys(filters);

      isValidFilters = keys.length > 0;

      for (let key of keys) {
        // Handle operators with sub-expressions recursively
        if (
          key === Operator.AND ||
          key === Operator.OR ||
          key === Operator.NOT
        ) {
          parsedResult[SequelizeSymbols[key]] = sortArrayFilters(filters[key]);
        }
        // Handle like/ilike for array of strings
        // filters[key] should have the name of the column + at least 2 query strings
        // thus, the filters[key].length > 2.. example: [ '#name', 'John', 'Jane' ]
        else if (
          (key === Operator.LIKE || key === Operator.ILIKE) &&
          filters[key].length > 2
        ) {
          const [parameter, ...arrayOfStrings] = filters[key];
          parsedResult = {
            [removeHashFromString(parameter)]: {
              [SequelizeSymbols[key]]: { [Op.any]: arrayOfStrings },
            },
          };
        } else {
          parsedResult = parseParametersForSequelize(key, filters[key]);
        }
      }
    }
  }

  return {
    results:
      isValidFilters && isDefault
        ? {
            where: parsedResult,
          }
        : parsedResult,
    errors,
  };
}

module.exports = parseFilters;
