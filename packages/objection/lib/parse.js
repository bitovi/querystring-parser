const lib = require("../../index");
const parseFilters = require("./parse-filter");
const parseInclude = require("./parse-include");
const parsePagination = require("./parse-page");
const parseSort = require("./parse-sort");

function parseQueries(query) {
  let orm = [];
  const parsedQuery = lib.parse(query);
  const { include, filter, sort, page } = parsedQuery;
  orm = [
    ...orm,
    ...parseInclude(include),
    ...parseFilters(filter),
    ...parseSort(sort),
    ...parsePagination(page),
  ];
  return orm;
}
//final format 
// {
// key: 'where',
// properties : 
// }

module.exports = {
  parseQueries,
};
