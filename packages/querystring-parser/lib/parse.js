const parseFilter = require("./parse-filter");
const parseFields = require("./parse-fields");
const parsePage = require("./parse-page");
const parseSort = require("./parse-sort");
const parseInclude = require("./parse-include");

function parse(querystring) {
  const filter = parseFilter(querystring);
  const fields = parseFields(querystring);
  const page = parsePage(querystring);
  const sort = parseSort(querystring);
  const include = parseInclude(querystring);

  return {
    filter: filter.results,
    fields: fields.results,
    page: page.results,
    sort: sort.results,
    include: include.results,
    errors: {
      filter: filter.errors,
      fields: fields.errors,
      page: page.errors,
      sort: sort.errors,
      include: include.errors,
    },
  };
}

module.exports = parse;
