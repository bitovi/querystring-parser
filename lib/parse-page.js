const qs = require("qs");
const isString = require("./helpers/is-string");
const QuerystringParsingError = require("./errors/querystring-parsing-error");

function parsePage(querystring) {
  const { page: qsPage } = qs.parse(querystring);
  const results = {};
  const errors = [];

  if (qsPage) {
    const { number, size } = qsPage;
    const numberWasProvided = isNonEmptyString(number);
    const sizeWasProvided = isNonEmptyString(size);

    if (numberWasProvided && !sizeWasProvided) {
      errors.push(
        new QuerystringParsingError({
          message: "Page number was provided but page size was not provided.",
          querystring,
          paramKey: "page[number]",
          paramValue: number,
        })
      );
    } else if (!numberWasProvided && sizeWasProvided) {
      errors.push(
        new QuerystringParsingError({
          message: "Page size was provided but page number was not provided.",
          querystring,
          paramKey: "page[size]",
          paramValue: size,
        })
      );
    } else {
      const parsedNumber = parseInt(number);
      const parsedSize = parseInt(size);

      const numberIsValid = !Number.isNaN(parsedNumber) && parsedNumber >= 0;
      const sizeIsValid = !Number.isNaN(parsedSize) && parsedSize > 0;

      if (!numberIsValid) {
        errors.push(
          new QuerystringParsingError({
            message: "Invalid page number was provided.",
            querystring,
            paramKey: "page[number]",
            paramValue: number,
          })
        );
      }
      if (!sizeIsValid) {
        errors.push(
          new QuerystringParsingError({
            message: "Invalid page size was provided.",
            querystring,
            paramKey: "page[size]",
            paramValue: size,
          })
        );
      }

      if (numberIsValid && sizeIsValid) {
        results.number = parsedNumber;
        results.size = parsedSize;
      }
    }
  }

  return {
    results,
    errors,
  };
}

function isNonEmptyString(value) {
  return isString(value) && value.length;
}

module.exports = parsePage;
