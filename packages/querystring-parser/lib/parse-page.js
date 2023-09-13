const qs = require("qs");
const isNonEmptyString = require("./helpers/is-non-empty-string");
const QuerystringParsingError = require("./errors/querystring-parsing-error");

function parsePage(querystring) {
  const { page: qsPage } = qs.parse(querystring);
  const results = {};
  const errors = [];

  if (qsPage) {
    const { number, size } = qsPage;
    const numberWasProvided = isNonEmptyString(number);
    const sizeWasProvided = isNonEmptyString(size);
    let parsedNumber;
    let numberIsValid;
    let parsedSize;
    let sizeIsValid;

    if (numberWasProvided) {
      parsedNumber = +number;
      numberIsValid = Number.isInteger(parsedNumber) && parsedNumber > 0;

      if (!numberIsValid) {
        errors.push(
          new QuerystringParsingError({
            message: "Page number should be a positive integer.",
            querystring,
            paramKey: "page[number]",
            paramValue: number,
          }),
        );
      }

      if (!sizeWasProvided) {
        errors.push(
          new QuerystringParsingError({
            message: "Page number was provided but page size was not provided.",
            querystring,
            paramKey: "page[size]",
            paramValue: "",
          }),
        );
      }
    }

    if (sizeWasProvided) {
      parsedSize = +size;
      sizeIsValid = Number.isInteger(parsedSize) && parsedSize > 0;

      if (!numberWasProvided) {
        errors.push(
          new QuerystringParsingError({
            message: "Page size was provided but page number was not provided.",
            querystring,
            paramKey: "page[number]",
            paramValue: "",
          }),
        );
      }

      if (!sizeIsValid) {
        errors.push(
          new QuerystringParsingError({
            message: "Page size should be a positive integer.",
            querystring,
            paramKey: "page[size]",
            paramValue: size,
          }),
        );
      }
    }

    if (numberIsValid && sizeIsValid) {
      results.number = parsedNumber;
      results.size = parsedSize;
    }
  }

  return {
    results,
    errors,
  };
}

module.exports = parsePage;
