const qs = require('qs')
const isString = require('./helpers/is-string')

function parsePage(queryString) {
  const { page: qsPage } = qs.parse(queryString)
  const results = {}
  const errors = []

  if (qsPage) {
    const { number, size } = qsPage
    const numberWasProvided = isNonEmptyString(number)
    const sizeWasProvided = isNonEmptyString(size)

    if (numberWasProvided && !sizeWasProvided) {
      errors.push(new Error(`Page number was provided but page size was not in querystring: '${queryString}'`))
    } else if (!numberWasProvided && sizeWasProvided) {
      errors.push(new Error(`Page size was provided but page number was not in querystring: '${queryString}'`))
    } else {
      const parsedNumber = parseInt(number)
      const parsedSize = parseInt(size)

      const numberIsValid = !Number.isNaN(parsedNumber) && parsedNumber >= 0
      const sizeIsValid = !Number.isNaN(parsedSize) && parsedSize > 0

      if (!numberIsValid) {
        errors.push(new Error(`Invalid page number provided in querystring: '${queryString}'`))
      }
      if (!sizeIsValid) {
        errors.push(new Error(`Invalid page size provided in querystring: '${queryString}'`))
      }

      if (numberIsValid && sizeIsValid) {
        results.number = parsedNumber
        results.size = parsedSize
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

module.exports = parsePage
