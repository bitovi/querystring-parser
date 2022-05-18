const qs = require('qs')

const parseFields = (queryString) => {
  const { fields: qsFields } = qs.parse(queryString)
  const results = {}
  const errors = []

  if (qsFields) {
  }

  return {
    results,
    errors
  }
}

const isString = (value) => {
  return typeof value === 'string' || value instanceof String
}

const isNonEmptyString = (value) => {
  return isString(value) && value.length
}

const removeDuplicatesReducer = (accumulator, currentValue) => {
  if (!accumulator.includes(currentValue)) {
    accumulator.push(currentValue)
  }
  return accumulator
}

const findDuplicates = (input) => {
  const duplicates = []
  input.forEach(value => {
    if (input.filter(val => val === value).length > 1) {
      duplicates.push(value)
    }
  })

  return [...new Set(duplicates)]
}

module.exports = {
  parseFields
}
