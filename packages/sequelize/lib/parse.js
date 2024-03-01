const lib = require("@bitovi/querystring-parser");
const parseFilters = require("./parse-filter");
const parsePagination = require("./parse-page");
const parseSort = require("./parse-sort");
const parseInclude = require("./parse-include");

function getSequelizeFindOptions(parsedQuery) {
  const {
    fields,
    filter,
    sort,
    page,
    include,
    errors: queryErrors,
  } = parsedQuery;

  const filterResult = parseFilters(filter, queryErrors?.filter);
  const includeResult = parseInclude(
    include,
    [...(queryErrors?.include ?? []), ...(queryErrors?.fields ?? [])],
    fields,
  );
  const sortResult = parseSort(sort, queryErrors?.sort);
  const pageResult = parsePagination(page, queryErrors?.page);

  let data = {
    ...sortResult.results,
    ...filterResult.results,
    ...includeResult.results,
    ...pageResult.results,
  };

  let errors = [
    ...sortResult.errors,
    ...filterResult.errors,
    ...includeResult.errors,
    ...pageResult.errors,
  ];

  return {
    orm: "sequelize",
    data,
    errors,
  };
}

function parse(query) {
  return getSequelizeFindOptions(lib.parse(query));
}

module.exports = { getSequelizeFindOptions, parse };
