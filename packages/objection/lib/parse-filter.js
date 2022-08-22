const {
  convertToOrFormat,
  removeHashFromString,
} = require("../helpers/helperfunctions");
const {
  isAnArray,
  containsNoErrorFromParser,
  isObject,
} = require("../helpers/validation");

const Operator = Object.freeze({
  EQUALS: "=",
  NOT_EQUALS: "<>",
  GREATER_THAN: ">",
  GREATER_OR_EQUAL: ">=",
  LESS_THAN: "<",
  LESS_OR_EQUAL: "<=",
  LIKE: "LIKE",
  IN: "IN",
  NOT_IN: "NOT IN",
  NOT: "NOT",
  AND: "AND",
  OR: "OR",
  IS_NULL: "IS NULL",
  IS_NOT_NULL: "IS NOT NULL",
});

const objectionFunctions = Object.freeze({
  default: "where",
  [Operator.NOT]: "whereNot",
  [Operator.NOT_IN]: "whereNotIn",
  [Operator.IN]: "whereIn",
  [Operator.IS_NULL]: "whereNull",
  [Operator.IS_NOT_NULL]: "whereNotNull",
});

//To reconstruct the parameters to objections format
function parseParametersForObjection(operator, value, isOr) {
  let sequelizeKey, sequelizeOperator, sequelizeValue;
  let fx, parameters;
  const specialOperators = [
    Operator.IN,
    Operator.NOT_IN,
    Operator.NOT,
    Operator.IS_NULL,
    Operator.IS_NOT_NULL,
  ];
  const isArray = Array.isArray(value);
  const isSpecialOperator = specialOperators.some(
    (op) => op.toLocaleLowerCase() === operator.toLocaleLowerCase()
  );
  sequelizeOperator = operator;
  if (isArray) {
    sequelizeKey = removeHashFromString(value[0]);
    if (isSpecialOperator) {
      //HANDLE IN AND NOT IN
      fx = objectionFunctions[operator];
      sequelizeValue = value.slice(1);
      parameters = [sequelizeKey, sequelizeValue];
    } else {
      fx = objectionFunctions["default"];
      sequelizeValue = value.length > 2 ? value?.slice(1) : value[1];
      parameters = [sequelizeKey, sequelizeOperator, sequelizeValue];
    }
  } else {
    //handle NULL AND NOT NULL
    sequelizeKey = removeHashFromString(value);
    fx = objectionFunctions[operator];
    parameters = [sequelizeKey];
  }
  return {
    fx: isOr ? convertToOrFormat(fx) : fx,
    parameters,
  };
}

//To handle "OR" AND "AND" recursively
function sortNestedFilters(filters, isOr = false) {
  let i = 0;
  let parsedArray = [];
  let errors = [];
  filters = isAnArray(filters) ? filters : [filters];
  for (let filter of filters) {
    //use the orWhere only from the second iteration.
    let useOr = isOr && i > 0;
    const parseFilterResponse = parseFilters(filter, [], useOr);
    parsedArray = [...parsedArray, ...parseFilterResponse.results];
    errors = [...errors, ...parseFilterResponse.errors];
    i++;
  }
  return parsedArray;
}

function parseFilters(filters, filterErrors, isOr = false) {
  let parsedArray = [];
  let errors = [];
  if (filters) {
    if (containsNoErrorFromParser(filterErrors)) {
      if (isObject(filters)) {
        const keys = Object.keys(filters);
        if (keys.length > 0) {
          for (let key of keys) {
            if (
              key === Operator.AND ||
              key === Operator.OR ||
              key === Operator.NOT
            ) {
              const parameters = sortNestedFilters(
                filters[key],
                key === Operator.OR
              );
              const fx =
                key === Operator.NOT
                  ? objectionFunctions[Operator.NOT]
                  : objectionFunctions.default;
              parsedArray = [
                ...parsedArray,
                {
                  fx: isOr ? convertToOrFormat(fx) : fx,
                  isNested: true,
                  parameters,
                },
              ];
            } else {
              const { fx, parameters } = parseParametersForObjection(
                key,
                filters[key],
                isOr
              );
              parsedArray.push({
                fx,
                isNested: false,
                parameters,
              });
            }
          }
        }
      } else {
        errors.push("Filter field must be an object");
      }
    } else {
      errors = filterErrors;
    }
  }
  return {
    results: parsedArray,
    errors,
  };
}

module.exports = parseFilters;
