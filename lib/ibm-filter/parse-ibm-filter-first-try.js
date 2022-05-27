const qs = require('qs')
const SqlOperator = require('../enums/sql-operator')
const IbmOperator = require('../enums/ibm-operator')
const isMongoNull = require('../mongo-filter/is-mongo-null')
const isMongoNumber = require('../mongo-filter/is-mongo-number')
const isMongoDate = require('../mongo-filter/is-mongo-date')
const stack = []

/** Parses "IBM-style" filter expression from of a querystring. */
const parseIbmFilter = (querystring) => {
  const errors = []
  let results

  // perform initial parse with qs lib
  const { filter: qsFilter } = qs.parse(querystring, { comma: true })

  const filterResults = []
  for (const expression of qsFilter) {


    // TODO: make better
    if (!bothFoundOrNeitherFound) {
      errors.push(new Error('uneven parenthesis found'))
      return { results, errors } // short circuit
    }


    

  }

  // multiple filters get 'OR'-ed together into a compound filter
  results = filterResults.reduce((prevs, curnt) => {
    return { 'OR': [prevs, curnt] }
  })

  return { results, errors }
}
const parseExpressionRec = (expression, parentOperator = undefined) => {
  stack.push(1)
  console.group(stack.length)
  console.log('expression: ', expression)
  console.log('parentOperator: ', parentOperator)
  const openParen = expression.indexOf('(')
  const closeParen = expression.lastIndexOf(')')
  const foundOpenParen = openParen !== -1
  const foundCloseParen = closeParen !== -1
  const bothFoundOrNeitherFound = foundOpenParen === foundCloseParen

  if(foundOpenParen) { 
    const ibmOperator = expression.slice(0,openParen)
    const sqlOperator = mapOperator(ibmOperator)
    const subExpression = expression.slice(openParen + 1, closeParen)
    const parsedSubExpression = parseExpressionRec(subExpression, ibmOperator)
    const end = { [sqlOperator]: parsedSubExpression }
    console.groupEnd()
    stack.pop()
    return end
  } else {
    const expElements = expression.split(',')
    const end = expElements.map(elm => coerceValue(elm, parentOperator))
    console.groupEnd()
    stack.pop()
    return end
  }
}

const coerceValue = (value, parentOperator = undefined) => {
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

const mapOperator = (operator) => {
  return {
    [IbmOperator.EQUALS]: SqlOperator.EQUALS,
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
  parseExpressionRec
}
