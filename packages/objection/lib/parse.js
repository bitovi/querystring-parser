const lib = require("../../index");
const parseFilters = require("./parse-filter");
const parseInclude = require("./parse-include");
const parsePagination = require("./parse-page");
const parseSort = require("./parse-sort");

function parseQueries(query) {
  const parsedQuery = lib.parse(query);
  const { include, filter, sort, page } = parsedQuery;
  let parsedData = [
    ...parseInclude(include),
    ...parseFilters(filter),
    ...parseSort(sort),
    ...parsePagination(page),
  ];
  return {
    orm: "objection",
    data: parsedData,
    errors: parsedQuery.errors,
  };
}

module.exports = {
  parseQueries,
};
