const lib = require("../../index");
const parseFilters = require("./parse-filter");
const parseInclude = require("./parse-include");
const parsePagination = require("./parse-page");
const parseSort = require("./parse-sort");

function parseQueries(query) {
  const parsedQuery = lib.parse(query);
  const { include, filter, sort, page, errors: queryErrors } = parsedQuery;

  const filterResult = parseFilters(filter, queryErrors?.filter);
  const includeResult = parseInclude(include, queryErrors?.include);
  const sortResult = parseSort(sort, queryErrors?.sort);
  const pageResult = parsePagination(page, queryErrors?.page);

  let data = [
    ...sortResult.results,
    ...filterResult.results,
    ...includeResult.results,
    ...pageResult.results,
  ];

  let errors = [
    ...sortResult.errors,
    ...filterResult.errors,
    ...includeResult.errors,
    ...pageResult.errors,
  ];

  return {
    orm: "objection",
    data,
    errors,
  };
}

module.exports = {
  parseQueries,
};
