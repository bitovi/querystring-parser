const lib = require("@bitovi/querystring-parser");
const parseFilters = require("./parse-filter");
const parseFields = require("./parse-fields");
const parsePagination = require("./parse-page");
const parseSort = require("./parse-sort");
const parseInclude = require("./parse-include");

function parse(query) {
  const parsedQuery = lib.parse(query);
  const {
    fields,
    filter,
    sort,
    page,
    include,
    errors: queryErrors,
  } = parsedQuery;

  const filterResult = parseFilters(filter, queryErrors?.filter);
  const fieldsResult = parseFields(fields, queryErrors?.fields);
  const includeResult = parseInclude(include, queryErrors?.include);
  const sortResult = parseSort(sort, queryErrors?.sort);
  const pageResult = parsePagination(page, queryErrors?.page);

  let data = [
    ...fieldsResult.results,
    ...sortResult.results,
    ...filterResult.results,
    ...includeResult.results,
    ...pageResult.results,
  ];

  let errors = [
    ...sortResult.errors,
    ...filterResult.errors,
    ...fieldsResult.errors,
    ...pageResult.errors,
    ...includeResult.errors,
  ];

  return {
    orm: "objection",
    data,
    errors,
  };
}

module.exports = parse;
