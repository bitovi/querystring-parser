const qs = require("qs");
const SqlOperator = require("../enums/sql-operator");
const IbmOperator = require("../enums/ibm-operator");
const isNullString = require("../helpers/is-null-string");
const isNumberString = require("../helpers/is-number-string");
const isDateString = require("../helpers/is-date-string");
const isString = require("../helpers/is-string");
const IbmValueType = require("../enums/ibm-value-type");
const QuerystringParsingError = require("../../lib/errors/querystring-parsing-error");

/** Parses "IBM-style" filter expression from of a querystring. */
function parseIbmFilter(querystring) {
  const errors = [];
  let results;

  // perform initial parse with qs lib
  let { filter: qsFilter } = qs.parse(querystring);
  // might wrap value in array for consistent logic
  qsFilter = Array.isArray(qsFilter) ? qsFilter : [qsFilter];

  const subResults = [];
  for (const expression of qsFilter) {
    try {
      subResults.push(parseExpression(expression));
    } catch (e) {
      errors.push(
        new QuerystringParsingError({
          message: e.message,
          querystring,
          paramKey: "filter",
          paramValue: expression,
        })
      );
      // break? all or nothing results?
    }
  }

  // multiple filters get 'OR'-ed together into a compound filter
  if (subResults.length) {
    results = subResults.reduce((prevs, curnt, _, arr) => {
      return arr.length ? { OR: [prevs, curnt] } : results;
    });
  }

  return { results, errors };
}

function parseExpression(expression) {
  const tokens = tokenizeExpression(expression);

  const stack = [];
  for (let i = tokens.length - 1; i >= 0; i--) {
    const token = tokens[i];
    const isOperator = Object.values(IbmOperator).includes(token);

    if (!isOperator) {
      // token is an operand
      stack.push(token);
    } else {
      // token is an operator
      // ANY - (n-ary operator)
      if (token === IbmOperator.ANY) {
        const anyOperands = [];
        while (isString(peek(stack))) {
          anyOperands.push(coerceValue(stack.pop()));
        }
        errorCheck(token, anyOperands.slice(1));
        stack.push({ [mapOperator(token)]: anyOperands });
      }

      // IS NULL - (unary operator)
      else if (token === IbmOperator.EQUALS && isNullString(peek(stack, 2))) {
        const attributeRef = coerceValue(stack.pop(), token);
        stack.pop(); // null - not included in output
        stack.push({ [mapOperator(token, true)]: attributeRef });
      }

      // NOT - (unary, higher order operator)
      else if (token === IbmOperator.NOT) {
        const objOperand = stack.pop();
        stack.push({ [mapOperator(token)]: objOperand });
      }

      // AND/OR - (binary, higher-order operators)
      else if ([IbmOperator.AND, IbmOperator.OR].includes(token)) {
        let operands = [];
        while (stack.length) {
          operands.push(stack.pop())
        }
        stack.push({ [mapOperator(token)]: operands });
      }

      // ...the rest - (binary operators)
      else {
        const attributeRef = coerceValue(stack.pop(), token);
        const value = coerceValue(stack.pop(), token);
        errorCheck(token, [value]);
        stack.push({
          [mapOperator(token, value === null)]: [attributeRef, value],
        });
      }
    }
  }

  return stack.pop();
}

function tokenizeExpression(expression) {
  let tokens = [expression];
  const delimiters = ["(", ")", ","];
  delimiters.forEach((delim) => {
    tokens = tokens.flatMap((token) =>
      token.split(delim).map((tok) => tok.trim())
    );
  });
  return tokens.filter((token) => !!token); // no empty/white-space strings
}

function coerceValue(value, parentOperator) {
  if (isNullString(value)) {
    // null
    return null;
  } else if (value.startsWith("'") && value.endsWith("'")) {
    // constant value
    value = value.slice(1, value.length - 1);
    if (isNumberString(value) && parentOperator && parentOperator != IbmOperator.CONTAINS) {
      // number
      return Number(value);
    } else if (isDateString(value)) {
      // date
      return value;
    } else {
      // string
      return wildCardString(value, parentOperator);
    }
  } else {
    // attribute reference
    return "#" + value;
  }
}

function mapOperator(operator, valueIsNull = false) {
  return {
    [IbmOperator.EQUALS]: valueIsNull
      ? SqlOperator.IS_NULL
      : SqlOperator.EQUALS,
    [IbmOperator.GREATER_THAN]: SqlOperator.GREATER_THAN,
    [IbmOperator.GREATER_OR_EQUAL]: SqlOperator.GREATER_OR_EQUAL,
    [IbmOperator.LESS_THAN]: SqlOperator.LESS_THAN,
    [IbmOperator.LESS_OR_EQUAL]: SqlOperator.LESS_OR_EQUAL,
    [IbmOperator.CONTAINS]: SqlOperator.LIKE,
    [IbmOperator.STARTS_WITH]: SqlOperator.LIKE,
    [IbmOperator.ENDS_WITH]: SqlOperator.LIKE,
    [IbmOperator.ANY]: SqlOperator.IN,
    [IbmOperator.NOT]: SqlOperator.NOT,
    [IbmOperator.AND]: SqlOperator.AND,
    [IbmOperator.OR]: SqlOperator.OR,
  }[operator];
}

function wildCardString(value, operator = undefined) {
  switch (operator) {
    case IbmOperator.CONTAINS:
      return `%${value}%`;
    case IbmOperator.STARTS_WITH:
      return `${value}%`;
    case IbmOperator.ENDS_WITH:
      return `%${value}`;
    default:
      return value;
  }
}

function errorCheck(operator, operands) {
  // blacklist of invalid value types per operator
  const invalidTypeMap = {
    [IbmOperator.GREATER_THAN]: [IbmValueType.NULL],
    [IbmOperator.GREATER_OR_EQUAL]: [IbmValueType.NULL],
    [IbmOperator.LESS_THAN]: [IbmValueType.NULL],
    [IbmOperator.LESS_OR_EQUAL]: [IbmValueType.NULL],
    [IbmOperator.CONTAINS]: [
      // IbmValueType.NUMBER,
      // IbmValueType.DATE,
      IbmValueType.ATTRIBUTE_REF,
      IbmValueType.NULL,
    ],
    [IbmOperator.STARTS_WITH]: [
      IbmValueType.NUMBER,
      IbmValueType.DATE,
      IbmValueType.ATTRIBUTE_REF,
      IbmValueType.NULL,
    ],
    [IbmOperator.ENDS_WITH]: [
      IbmValueType.NUMBER,
      IbmValueType.DATE,
      IbmValueType.ATTRIBUTE_REF,
      IbmValueType.NULL,
    ],
    [IbmOperator.ANY]: [IbmValueType.ATTRIBUTE_REF],
  };

  // throw error for any invalid operator / value type combos
  if (Object.keys(invalidTypeMap).includes(operator)) {
    invalidTypeMap[operator].forEach((valueType) => {
      operands.forEach((operand) => {
        if (typeOfValue(operand) === valueType) {
          throw new Error(
            `"${operator}" operator should not be used with ${valueType.description} value`
          );
        }
      });
    });
  }

  // throw error if "ANY" operator has multiple types
  if (operator === IbmOperator.ANY) {
    const valueTypes = operands
      .map(typeOfValue)
      .filter((v) => v !== IbmValueType.NULL);
    const hasMultipleTypes =
      valueTypes.length && !valueTypes.every((vt) => vt === valueTypes[0]);
    if (hasMultipleTypes) {
      throw new Error(
        `"any" operator should not be used with multiple value types`
      );
    }
  }
}

function typeOfValue(value) {
  if (value === null) {
    return IbmValueType.NULL;
  } else if (!isNaN(value)) {
    return IbmValueType.NUMBER;
  } else if (isDateString(value)) {
    return IbmValueType.DATE;
  } else if (isString(value) && value[0] === "#") {
    return IbmValueType.ATTRIBUTE_REF;
  } else if (isString(value)) {
    return IbmValueType.STRING;
  }
}

/**
 * Peek at the nth-to-last element in an array. Default is the last element.
 * Node doesn't support Array.prototype.at() until v16.5.0.
 */
function peek(arr, n = 1) {
  return arr[arr.length - n];
}

module.exports = parseIbmFilter;
