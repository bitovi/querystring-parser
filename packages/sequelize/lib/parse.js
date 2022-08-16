const lib = require("@bitovi/querystring-parser");
const parseFilters = require("./parse-filter");
const parseField = require("./parse-fields");
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
  console.log(filter);

  const filterResult = parseFilters(filter, queryErrors?.filter);
  const includeResult = parseInclude(include, queryErrors?.filter);
  const fieldsResult = parseField(fields, queryErrors?.fields);
  const sortResult = parseSort(sort, queryErrors?.sort);
  const pageResult = parsePagination(page, queryErrors?.page);

  let data = {
    ...sortResult.results,
    ...filterResult.results,
    ...includeResult.results,
    ...fieldsResult.results,
    ...pageResult.results,
  };

  let errors = [
    ...sortResult.errors,
    ...filterResult.errors,
    ...includeResult.errors,
    ...fieldsResult.errors,
    ...pageResult.errors,
  ];

  return {
    orm: "sequelize",
    data,
    errors,
  };
}

module.exports = parse;
