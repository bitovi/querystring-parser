const qs = require('qs')
const SqlOperator = require('../enums/sql-operator')
const IbmOperator = require('../enums/ibm-operator')
const isNullString = require('../helpers/is-null-string')
const isNumberString = require('../helpers/is-number-string')
const isDateString = require('../helpers/is-date-string')
const isString = require('../helpers/is-string')
const IbmValueType = require('../enums/ibm-value-type')

/** Parses "IBM-style" filter expression from of a querystring. */
function parseIbmFilter(querystring) {
  const errors = []
  let results

  // perform initial parse with qs lib
  let { filter: qsFilter } = qs.parse(querystring)
  // might wrap value in array for consistent logic
  qsFilter = Array.isArray(qsFilter) ? qsFilter : [qsFilter]

  const subResults = []
  for (const expression of qsFilter) {
    try{
      subResults.push(parseExpression(expression))
    } catch(e) {
      errors.push(e)
      // break? all or nothing results?
    }
  }

  // multiple filters get 'OR'-ed together into a compound filter
  if (subResults.length) {
    results = subResults.reduce((prevs, curnt, _, arr) => {
      return arr.length ? { 'OR': [prevs, curnt] } : results
    })
  }

  return { results, errors }
}

function parseExpression(expression) {
  const tokens = tokenizeExpression(expression)

  const stack = []
  for(let i = tokens.length - 1; i >= 0; i--) {
    const token = tokens[i]
    const isOperator = Object.values(IbmOperator).includes(token)

    if (!isOperator) { // token is an operand
      stack.push(token)
    } else { // token is an operator
      // ANY - (n-ary operator)
      if (token === IbmOperator.ANY) {
        const anyOperands = []
        while(isString(stack.at(-1))) {
          anyOperands.push(coerceValue(stack.pop()))
        }
        errorCheck(token, anyOperands.slice(1))
        stack.push({[mapOperator(token)]: anyOperands })
      } 

      // IS NULL - (unary operator)
      else if (token === IbmOperator.EQUALS && isNullString(stack.at(-2))) {
        const attributeRef = coerceValue(stack.pop(), token)
        stack.pop() // null - not included in output
        stack.push({[mapOperator(token, true)]: attributeRef })
      }

      // NOT - (unary, higher order operator)
      else if (token === IbmOperator.NOT) {
        const objOperand = stack.pop()
        stack.push({[mapOperator(token)]: objOperand })
      }

      // AND/OR - (binary, higher-order operators)
      else if ([IbmOperator.AND, IbmOperator.OR].includes(token)) {
        const objOperandA = stack.pop()
        const objOperandB = stack.pop()
        stack.push({[mapOperator(token)]: [objOperandA, objOperandB]})
      } 
      
      // ...the rest - (binary operators)
      else {
        const attributeRef = coerceValue(stack.pop(), token)
        const value = coerceValue(stack.pop(), token)
        errorCheck(token, [value])
        stack.push({[mapOperator(token, value === null)]: [attributeRef, value]})
      }
    }
  }

  return stack.pop()
}

function tokenizeExpression(expression) {
  // TODO: what about string values with (),\' chars inside?
  let tokens = [expression]
  const delimiters = ['(', ')', ',']
  delimiters.forEach(delim => {
    tokens = tokens.flatMap(token => token.split(delim).map(tok => tok.trim()))
  })
  return tokens.filter(token => !!token) // no empty/white-space strings 
}

function coerceValue(value, parentOperator) {
  if (isNullString(value)) { // null
    return null
  } else if (value.startsWith("'") && value.endsWith("'")) { // constant value
    value = value.slice(1, value.length-1)
    if(isNumberString(value)) { // number
      return Number(value)
    } else if (isDateString(value)){ // date
      return value
    } else { // string
      return wildCardString(value, parentOperator)
    }
  } else { // attribute reference
    return '#' + value
  }
}

function mapOperator(operator, valueIsNull = false) {
  return {
    [IbmOperator.EQUALS]: valueIsNull ? SqlOperator.IS_NULL : SqlOperator.EQUALS,
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
    [IbmOperator.OR]: SqlOperator.OR
  }[operator]
}

function wildCardString(value, operator = undefined) {
  switch (operator) {
    case IbmOperator.CONTAINS:
      return `%${value}%`
    case IbmOperator.STARTS_WITH:
      return `${value}%`
    case IbmOperator.ENDS_WITH:
      return `%${value}`
    default:
      return value
  }
}

function errorCheck(operator, operands) {
  const invalidTypeMap = {
    [IbmOperator.GREATER_THAN]: [IbmValueType.NULL],
    [IbmOperator.GREATER_OR_EQUAL]: [IbmValueType.NULL],
    [IbmOperator.LESS_THAN]: [IbmValueType.NULL],
    [IbmOperator.LESS_OR_EQUAL]: [IbmValueType.NULL],
    [IbmOperator.CONTAINS]: [IbmValueType.NUMBER, IbmValueType.DATE, IbmValueType.ATTRIBUTE_REF, IbmValueType.NULL],
    [IbmOperator.STARTS_WITH]: [IbmValueType.NUMBER, IbmValueType.DATE, IbmValueType.ATTRIBUTE_REF, IbmValueType.NULL],
    [IbmOperator.ENDS_WITH]: [IbmValueType.NUMBER, IbmValueType.DATE, IbmValueType.ATTRIBUTE_REF, IbmValueType.NULL],
    [IbmOperator.ANY]: [IbmValueType.ATTRIBUTE_REF],
  }

  if (!Object.keys(invalidTypeMap).includes(operator)) {
    return;
  }

  invalidTypeMap[operator].forEach(valueType => {
    operands.forEach((operand) => {
      if (valueIsOfType(operand, valueType)) {
        throw new Error(`"${operator}" operator should not be used with ${valueType.description} value`)
      }
    })
  })
}

function valueIsOfType(value, valueType) {
  switch (valueType) {
    case IbmValueType.NULL:
      return value === null
    case IbmValueType.NUMBER:
      return value !== null && !isNaN(value)
    case IbmValueType.DATE:
      return isDateString(value)
    case IbmValueType.ATTRIBUTE_REF:
      return isString(value) && value[0] === '#'
  }
}

module.exports = parseIbmFilter
