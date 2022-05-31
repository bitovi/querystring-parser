const qs = require('qs')
const isString = require('./helpers/is-string')

function parseFields(queryString) {
  const { fields: qsFields } = qs.parse(queryString)
  const results = {}
  const errors = []

  if (qsFields) {
    for (const [type, fieldsInput] of Object.entries(qsFields)) {
      let fieldsArray

      if (typeof fieldsInput === 'string') {
        // this is the default expected scenario
        fieldsArray = fieldsInput.split(',')
      } else if (Array.isArray(fieldsInput)) {
        // this is what will happen if the type is specified twice like "fields[articles]=a&fields[articles]=b"
        fieldsArray = fieldsInput
      } else {
        // must assume the querystring did not follow JSON:API spec for sparse fieldsets
        // See: https://jsonapi.org/format/#fetching-sparse-fieldsets
        errors.push(new Error(`Incorrect format for fields in querystring: '${queryString}'`))
      }

      if (fieldsArray) {
        // add errors for any duplicate fields
        const duplicates = findDuplicates(fieldsArray)
        duplicates.forEach(duplicate => {
          errors.push(new Error(`Duplicated field '${duplicate}' for type '${type}' detected in querystring: '${queryString}'`))
        })

        // results
        results[type] = fieldsArray
          .filter(isNonEmptyString)
          .reduce(removeDuplicatesReducer, [])
      }
    }
  }

  return {
    results,
    errors
  }
}

function isNonEmptyString(value) {
  return isString(value) && value.length
}

function removeDuplicatesReducer(accumulator, currentValue) {
  if (!accumulator.includes(currentValue)) {
    accumulator.push(currentValue)
  }
  return accumulator
}

function findDuplicates(input) {
  const duplicates = []
  input.forEach(value => {
    if (input.filter(val => val === value).length > 1) {
      duplicates.push(value)
    }
  })

  return [...new Set(duplicates)]
}

module.exports = parseFields
