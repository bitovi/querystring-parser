const qs = require('qs')
const determineFilterStyle = require('./helpers/determine-filter-style')
const FilterStyle = require('./enums/filter-style')
const MongoOperator = require('./enums/mongo-operator')
const SqlOperator = require('./enums/sql-operator')
const isMongoNull = require('./helpers/is-mongo-null')
const areMongoTypesTheSame = require('./helpers/are-mongo-types-the-same')
const MongoValueType = require('./enums/mongo-value-type')

const parseFilter = (queryString) => {
  let results
  const errors = []
  let style

  try {
    style = determineFilterStyle(queryString)
  } catch (e) {
    errors.push(e)
  }

  if (style) {
    const parserMap = {
      [FilterStyle.MONGO_DB]: parseMongoDBFilter,
      [FilterStyle.IBM]: parseIBMFIlter,
    }
    const styleParserReturn = parserMap[style](queryString)
    results = styleParserReturn.results
    errors.push(...styleParserReturn.errors)
  }

  return { results, errors }
}

const parseMongoDBFilter = (querystring) => {
  const errors = []
  let results

  const { filter: qsFilter } = qs.parse(querystring, { comma: true })

  const fieldResults = []
  for (const [field, opVal] of Object.entries(qsFilter)) {

    /**************************************************************
     * 1. Parse field, operator, and value(s) as strings 
     **************************************************************/
    let providedOperator // the operator - as qs parsed it
    let providedValue // the value - as qs parsed it

    if (typeof opVal !== 'object') { // ex: filter[age]=25
      providedValue = opVal
    } else {
      if (Array.isArray(opVal)) { // ex: filter[age]=24,25
          providedValue = opVal
      } else { // ex: filter[age][$in]=24,25
        [providedOperator, providedValue] = Object.entries(opVal)[0]
      }
    }

    const operatorWasOmitted = providedOperator === undefined
    const providedValueWasArray = Array.isArray(providedValue)

    /**************************************************************
     * 2. Apply defaults and type coersion
     **************************************************************/
    let operator = providedOperator
    let values = providedValueWasArray ? providedValue : [providedValue]

    const valueType = areMongoTypesTheSame(values)
    if (!valueType) {
      errors.push(new Error('arrays should not mix multiple value types'))
      return { results, errors } // TODO: maybe make this re-usable and well named?
    }

    // coerce values
    values = values.map(value => {
      if (isMongoNull(value)) {
        return null
      } else if (valueType === MongoValueType.NUMBER) {
        return Number(value)
      } else {
        return value
      }
    })

    // nail down mongo operator
    if (operatorWasOmitted) {
      if (providedValueWasArray) {
        operator = MongoOperator.IN
      } else {
        switch (valueType) {
          case MongoValueType.NUMBER:
          case MongoValueType.DATE:
            operator = MongoOperator.EQUALS
            break
          case MongoValueType.NULL:
            operator = MongoOperator.IS_NULL
            break
          case MongoValueType.STRING:
          default:
            operator = MongoOperator.ILIKE
            break
        }
      }
    }

    /**************************************************************
     * ?. Check for errors
     **************************************************************/
    // array check first
    if (providedValueWasArray
      && ![
        MongoOperator.IN,
        MongoOperator.NOT_IN
      ].includes(operator)
    ) {
      errors.push(new Error(`"${operator}" operator should not be used with array value`))
      return { results, errors }; // short circuit
    }

    // null compatability check
    if (valueType === MongoValueType.NULL
      && [
        MongoOperator.GREATER_THAN,
        MongoOperator.GREATER_OR_EQUAL,
        MongoOperator.LESS_THAN,
        MongoOperator.LESS_OR_EQUAL,
        MongoOperator.ILIKE,
      ].includes(operator)
    ) {
      errors.push(new Error(`"${operator}" operator should not be used with null value`))
      return { results, errors }; // short circuit
    }

    // number compatability check
    if (valueType === MongoValueType.NUMBER && operator === MongoOperator.ILIKE) {
      errors.push(new Error(`"${operator}" operator should not be used with number values`))
      return { results, errors }; // short circuit
    }

    // date compatability check
    if (valueType === MongoValueType.DATE && operator === MongoOperator.ILIKE) {
      errors.push(new Error(`"${operator}" operator should not be used with date values`))
      return { results, errors }; // short circuit
    }

    /**************************************************************
     * 3. Map mongodb-style operators and values to the SQL domain
     **************************************************************/

    let sqlOperator = {
      [MongoOperator.EQUALS]: SqlOperator.EQUALS,
      [MongoOperator.IS_NULL]: SqlOperator.EQUALS,
      [MongoOperator.NOT_EQUALS]: SqlOperator.NOT_EQUALS,
      [MongoOperator.GREATER_THAN]: SqlOperator.GREATER_THAN,
      [MongoOperator.GREATER_OR_EQUAL]: SqlOperator.GREATER_OR_EQUAL,
      [MongoOperator.LESS_THAN]: SqlOperator.LESS_THAN,
      [MongoOperator.LESS_OR_EQUAL]: SqlOperator.LESS_OR_EQUAL,
      [MongoOperator.ILIKE]: SqlOperator.LIKE,
      [MongoOperator.IN]: SqlOperator.IN,
      [MongoOperator.NOT_IN]: SqlOperator.NOT_IN
    }[operator]

    // adjust EQUALS and NOT EQUALS operators for null values
    if ([SqlOperator.EQUALS, SqlOperator.NOT_EQUALS].includes(sqlOperator)
      && valueType === MongoValueType.NULL
    ) {
      sqlOperator = {
        [SqlOperator.EQUALS]: SqlOperator.IS_NULL,
        [SqlOperator.NOT_EQUALS]: SqlOperator.IS_NOT_NULL,
      }[sqlOperator]
    }

    // map sql values
    const sqlValues = values.map((val => {
      return sqlOperator === SqlOperator.LIKE ? `%${val}%` : val
    }))

    // unwrap single-value array (except for auto-wrappable operators)
    const unwrapIsNeeded = sqlValues.length === 1
      && ![SqlOperator.IN, SqlOperator.NOT_IN].includes(sqlOperator)
    const sqlValue = unwrapIsNeeded ? sqlValues[0] : sqlValues

    // format like json-logic
    if(sqlValue === null){
      fieldResults.push({ [sqlOperator]: field })
    } else {
      fieldResults.push({ [sqlOperator]: [field, sqlValue] })
    }
  }

  // multiple filters get "AND"-ed together into a compound filter
  results = fieldResults.reduce((prevs, curnt) => {
    return { 'AND': [prevs, curnt] }
  })

  return { results, errors }
}

const parseIBMFIlter = (querystring) => {
  // todo
}

module.exports = {
  parseFilter,
  parseMongoDBFilter
}
