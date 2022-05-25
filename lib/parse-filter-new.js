const qs = require('qs')
const determineFilterStyle = require('./helpers/determine-filter-style')
const FilterStyle = require('./enums/filter-style')
const isMongoNumber = require('./helpers/is-mongo-number')
const MongoOperator = require('./enums/mongo-operator')
const SqlOperator = require('./enums/sql-operator')
const isMongoDate = require('./helpers/is-mongo-date')
const isMongoNull = require('./helpers/is-mongo-null')

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

  // TODO: add quick notes about how we're traversing the nested objects
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

    // make sure all values are same type/null TODO: pull this out into enum, doc
    const MongoValueTypes = {
      STRING: Symbol('STRING'),
      NUMBER: Symbol('NUMBER'),
      DATE: Symbol('DATE'),
      NULL: Symbol('NULL')
    }


    // make this return the type or false TODO: gross. pull this out and document
    const mongoTypesAreTheSame = (vals) => {
      const types = vals.map(val => {
        if (isMongoNumber(val)) {
          return MongoValueTypes.NUMBER
        } else if (isMongoDate(val)) {
          return MongoValueTypes.DATE
        } else if (isMongoNull(val)) {
          return MongoValueTypes.NULL
        } else {
          return MongoValueTypes.STRING
        }
      })

      const allNull = types.every(type => type === MongoValueTypes.NULL)
      if (allNull) {
        return MongoValueTypes.NULL
      } else {
        const allSameOrNull = types.filter(type => type === MongoValueTypes.NULL)
          .every((type, index, array) => type === array[1])

        return allSameOrNull ? types.find(type => type !== MongoValueTypes.NULL) : false
      }
    }

    const valueType = mongoTypesAreTheSame(values)

    if (!valueType) {
      errors.push(new Error('nope')) // TODO: better message
      return { results, errors } // TODO: maybe make this re-usable and well named?
    }

    // coerce values
    values = values.map(value => {
      if (isMongoNull(value)) {
        return null
      } else if (valueType === MongoValueTypes.NUMBER) {
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
          case MongoValueTypes.NUMBER:
          case MongoValueTypes.DATE:
            operator = MongoOperator.EQUALS
            break
          case MongoValueTypes.NULL:
            operator = MongoOperator.IS_NULL
            break
          case MongoValueTypes.STRING:
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

    // null check
    if (values[0] === null
      && [
        MongoOperator.GREATER_THAN,
        MongoOperator.GREATER_OR_EQUAL,
        MongoOperator.LESS_THAN,
        MongoOperator.LESS_OR_EQUAL,
        MongoOperator.ILIKE,
        MongoOperator.IN,
        MongoOperator.NOT_IN
      ].includes(operator)
    ) {
      errors.push(new Error(`"${operator}" operator should not be used with null value`))
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

    // check if provided value was null
    if (values[0] === null) {
      sqlOperator = {
        [SqlOperator.EQUALS]: SqlOperator.IS_NULL,
        [SqlOperator.NOT_EQUALS]: SqlOperator.IS_NOT_NULL,
      }[sqlOperator]
    }

    // map sql values
    const sqlValues = values.map((val => {
      return sqlOperator === SqlOperator.LIKE ? `%${val}%` : val
    }))

    // unwrap single-value array
    const sqlValue = sqlValues.length === 1 ? sqlValues[0] : sqlValues

    // format like json-logic
    if(sqlValue === null){
      fieldResults.push({ [sqlOperator]: field })
    } else {
      fieldResults.push({ [sqlOperator]: [field, sqlValue] })
    }
  }

  // TODO: results = all field results "and"ed together
  results = fieldResults[0]

  return { results, errors }

}

const parseIBMFIlter = (querystring) => {
  // todo
}


const parseFilterOld = (queryString) => {
  const { filter } = qs.parse(queryString)
  const comparisonObjects = []

  if (filter) {
    for (const [key, value] of Object.entries(filter)) {
      const isNum = !isNaN(Number(value))
      const isDate = !isNaN(Date.parse(value))
      const isEqual = isNum || isDate
      let comparator = 'ilike' // default
      let sqlValue = value

      // check for explicit comparator
      // TODO improve to catch typos/unsupported comparators
      if (typeof value === 'object') {
        comparator = Object.keys(value)[0] // should only be one key?
        sqlValue = value[comparator]
      }

      // comparator conversion
      comparator = {
        // mongodb comparators -> objection comparators
        $eq: '=',
        $ne: '!=',
        $gt: '>',
        $gte: '>=',
        $lt: '<',
        $lte: '<=',
        // TODO: add when array values are supported
        // $in: '',
        // $nin: '',
        // objection comparators -> objection comparators
        ilike: 'ilike'
      }[comparator] || comparator

      // default to "=" for dates and numbers (instead of ilike)
      if (isEqual && comparator === 'ilike') {
        comparator = '='
      }

      // surround value with wildcards in the case of ilike
      if (comparator === 'ilike') {
        sqlValue = `%${sqlValue}%`
      }

      comparisonObjects.push({ field: key, comparator, value: sqlValue })
    }
  }

  return {
    results: comparisonObjects,
    errors: []
  }
}

module.exports = {
  parseFilter,
  parseMongoDBFilter
}
