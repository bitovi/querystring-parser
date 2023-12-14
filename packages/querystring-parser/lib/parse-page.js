const qs = require("qs");
const QuerystringParsingError = require("./errors/querystring-parsing-error");

function parsePage(querystring) {
  const { page: qsPage } = qs.parse(querystring);
  const results = {};
  const errors = [];

  if (qsPage) {
    const { number, size, limit, offset, ...unsupported } = qsPage;

    if (Object.keys(unsupported).length) {
      errors.push(
        ...Object.entries(unsupported).map(
          ([paramKey, paramValue]) =>
            new QuerystringParsingError({
              message: `Page ${paramKey} is not supported.`,
              querystring,
              paramKey: `page[${paramKey}]`,
              paramValue,
            }),
        ),
      );
    }

    if (number || size) {
      let parsedNumber;
      let numberIsValid;
      let parsedSize;
      let sizeIsValid;

      if (number) {
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

        if (!size) {
          errors.push(
            new QuerystringParsingError({
              message:
                "Page number was provided but page size was not provided.",
              querystring,
              paramKey: "page[size]",
              paramValue: "",
            }),
          );
        }
      }

      if (size) {
        parsedSize = +size;
        sizeIsValid = Number.isInteger(parsedSize) && parsedSize > 0;

        if (!number) {
          errors.push(
            new QuerystringParsingError({
              message:
                "Page size was provided but page number was not provided.",
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

    if (offset || limit) {
      let parsedOffset;
      let offsetIsValid;
      let parsedLimit;
      let limitIsValid;

      if (offset) {
        parsedOffset = +offset;
        offsetIsValid = Number.isInteger(parsedOffset) && parsedOffset >= 0;

        if (!offsetIsValid) {
          errors.push(
            new QuerystringParsingError({
              message: "Page offset should be a non-negative integer.",
              querystring,
              paramKey: "page[offset]",
              paramValue: offset,
            }),
          );
        }

        if (!limit) {
          errors.push(
            new QuerystringParsingError({
              message:
                "Page offset was provided but page limit was not provided.",
              querystring,
              paramKey: "page[limit]",
              paramValue: "",
            }),
          );
        }
      }

      if (limit) {
        parsedLimit = +limit;
        limitIsValid = Number.isInteger(parsedLimit) && parsedLimit > 0;

        if (!offset) {
          parsedOffset = 0;
        }

        if (!limitIsValid) {
          errors.push(
            new QuerystringParsingError({
              message: "Page limit should be a positive integer.",
              querystring,
              paramKey: "page[limit]",
              paramValue: limit,
            }),
          );
        }
      }

      if (offsetIsValid && limitIsValid) {
        results.offset = parsedOffset;
        results.limit = parsedLimit;
      }
    }
  }

  return {
    results,
    errors,
  };
}

module.exports = parsePage;
