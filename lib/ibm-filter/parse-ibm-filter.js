const qs = require('qs')
const SqlOperator = require('../enums/sql-operator')
const IbmOperator = require('../enums/ibm-operator')
const isMongoNull = require('../mongo-filter/is-mongo-null')
const isMongoNumber = require('../mongo-filter/is-mongo-number')
const isMongoDate = require('../mongo-filter/is-mongo-date')
const isString = require('../helpers/is-string')

/** Parses "IBM-style" filter expression from of a querystring. */
const parseIbmFilter = (querystring) => {
  const errors = []
  let results

  // perform initial parse with qs lib
  let { filter: qsFilter } = qs.parse(querystring)
  // might wrap value in array for consistent logic
  qsFilter = Array.isArray(qsFilter) ? qsFilter : [qsFilter]

  const filterResults = []
  for (const expression of qsFilter) {
    filterResults.push(parseExpression(expression))
  }

  // multiple filters get 'OR'-ed together into a compound filter
  results = filterResults.reduce((prevs, curnt) => {
    return { 'OR': [prevs, curnt] }
  })

  return { results, errors }
}

const parseExpression = (expression) => {
  const tokens = tokenizeExpression(expression)

  const stack = []
  for(let i = tokens.length - 1; i >= 0; i--) {
    const token = tokens[i]
    const isOperator = Object.values(IbmOperator).includes(token)
    if (isOperator) {
      if (token === IbmOperator.NOT) {
        // do NOT things (unary operator)
        const objOperand = stack.pop()
        stack.push({[mapOperator(token)]: objOperand })
      } else if (token === IbmOperator.ANY) {
        // do ANY things (n-ary operator)
        const anyOperands = []
        while(isString(stack.at(-1))) {
          anyOperands.push(coerceValue(stack.pop()))
        }
        stack.push({[mapOperator(token)]: anyOperands })
      } else if ([IbmOperator.AND, IbmOperator.OR].includes(token)) {
        // do higher order things (higher order binary operators)
        const objOperandA = stack.pop()
        const objOperandB = stack.pop()
        stack.push({[mapOperator(token)]: [objOperandA, objOperandB]})
      } else {
        // do other things (simple binary operators)
        const attributeRef = coerceValue(stack.pop(), token)
        const value = coerceValue(stack.pop(), token)
        stack.push({[mapOperator(token, value === null)]: [attributeRef, value]})
      }
    } else {
      // do operand things
      stack.push(token)
    }
  }

  return stack.pop()
}

const tokenizeExpression = (expression) => {
  // TODO: what about string values with (),\' chars inside?
  let tokens = [expression]
  const delimiters = ['(', ')', ',']
  delimiters.forEach(delim => {
    tokens = tokens.flatMap(token => token.split(delim).map(tok => tok.trim()))
  })
  return tokens.filter(token => !!token) // no empty/white-space strings 
}

const coerceValue = (value, parentOperator) => {
  if (isMongoNull(value)) { // null
    return null
  } else if (value.startsWith("'") && value.endsWith("'")) { // constant value
    value = value.slice(1, value.length-1)
    if(isMongoNumber(value)) { // number
      return Number(value)
    } else if (isMongoDate(value)){ // date
      return value
    } else { // string
      return wildCardString(value, parentOperator)
    }
  } else { // attribute reference
    return '#' + value
  }
}

const mapOperator = (operator, valueIsNull = false) => {
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

const wildCardString = (value, operator = undefined) => {
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

module.exports = {
  parseIbmFilter,
  parseExpression,
  tokenizeExpression
}
