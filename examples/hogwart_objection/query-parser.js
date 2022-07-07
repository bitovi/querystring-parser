const lib = require("../../index");

function parseParametersForObjection(operator, value) {
  return Array.isArray(value)
    ? value.length > 2
      ? [value[0], operator, value.slice(1)]
      : [value[0], operator, value[1]]
    : [value, operator];
}

function parseSelects(include) {
  const parsedArray = [];
  if (include.length > 0) {
    parsedArray.push({
      fx: "select",
      parameters: include,
    });
  }
  return parsedArray;
}

function sortArrayFilters(filters, isOr = false) {
  let i = 0;
  let parsedArray = [];
  for (let filter of filters) {
    let useOr = isOr && i > 0;
    parsedArray = [...parsedArray, ...parseFilters(filter, useOr)];
    i++;
  }
  return parsedArray;
}

function parseFilters(filters, isOr = false) {
  let parsedArray = [];
  if (!filters) return parsedArray;
  const keys = Object.keys(filters);
  if (keys.length > 0) {
    for (let key of keys) {
      if (key === "AND") {
        parsedArray = [...parsedArray, ...sortArrayFilters(filters[key])];
      } else if (key === "OR") {
        parsedArray = [...parsedArray, ...sortArrayFilters(filters[key], true)];
      } else {
        const parameters = parseParametersForObjection(key, filters[key]);
        parsedArray.push({
          fx: isOr ? "orWhere" : "where",
          parameters,
        });
      }
    }
  }
  return parsedArray;
}

function parsePagination(page) {
  const parsedArray = [];
  if (page.number) {
    const offset = (page.number - 1) * page.size;
    parsedArray.push({
      fx: "offset",
      parameters: [offset],
    });
  }
  if (page.size) {
    parsedArray.push({
      fx: "limit",
      parameters: [page.size],
    });
  }
  return parsedArray;
}

function parseSort(sort) {
  const parsedArray = [];
  if (sort.length > 0) {
    const newSortFields = sort.map((field) => {
      return {
        column: field.field,
        order: field.direction,
      };
    });
    parsedArray.push({
      fx: "orderBy",
      parameters: [newSortFields],
    });
  }
  return parsedArray;
}

function parseQueries(query) {
  let orm = [];
  const parsedQuery = lib.parse(query);
  const { include, filter, sort, page } = parsedQuery;
  orm = [
    ...orm,
    ...parseSelects(include),
    ...parseFilters(filter),
    ...parseSort(sort),
    ...parsePagination(page),
  ];
  return orm;
}

module.exports = {
  parseQueries,
};
