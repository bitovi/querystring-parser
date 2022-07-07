const lib = require("../../index");
const { Op } = require("sequelize");

const dataObj = Object.freeze({
  LIKE: Op.like,
  OR: Op.or,
  AND: Op.and,
  NOT: Op.not,
  "=": Op.eq,
  ">": Op.gt,
  ">=": Op.gte,
  "<": Op.lt,
  "<=": Op.lte,
  IN: Op.in,
});

function parseParametersForSequelize(operator, value) {
  //all parameters are ('age','<',20)
  //i.e ('field','operator','value') format
  return Array.isArray(value)
    ? {
        [value[0]]: {
          [dataObj[operator]]: value.length > 2 ? value.slice(1) : value[1],
        },
      }
    : [value, operator];
}

function sortArrayFilters(filters) {
  let parsedArray = [];
  for (let filter of filters) {
    parsedArray.push(parseFilters(filter));
  }
  console.log(parsedArray);
  return parsedArray;
}

function parseFilters(filters) {
  let parsedArray = {};
  const keys = Object.keys(filters);
  for (let key of keys) {
    if (key === "AND" || key === "OR") {
      parsedArray[dataObj[key]] = sortArrayFilters(filters[key]);
    } else {
      const parsedKey = parseParametersForSequelize(key, filters[key]);
      parsedArray = { ...parsedArray, ...parsedKey };
    }
  }
  return parsedArray;
}

function parseInclude(include) {
  const parsedArray = {};
  if (include.length > 0) {
    parsedArray.attributes = include;
  }
  return parsedArray;
}

function parsePage(page) {
  const parsedArray = {};
  if (page.number) {
    const offset = (page.number - 1) * page.size;
    parsedArray.offset = offset;
  }
  if (page.size) {
    parsedArray.limit = page.size;
  }
  return parsedArray;
}

function parseSort(sort) {
  const parsedArray = {};
  if (sort.length > 0) {
    const newSortFields = sort.map((field) => [field.field, field.direction]);
    parsedArray.order = newSortFields;
  }
  return parsedArray;
}

function parseQueries(query) {
  let orm = {};
  const parsedQuery = lib.parse(query);
  console.log(parsedQuery);
  const { include, filter, sort, page } = parsedQuery;
  orm = {
    ...orm,
    ...parseInclude(include),
    ...{ where: parseFilters(filter) },
    ...parsePage(page),
    ...parseSort(sort),
  };
  console.log(orm);
  return orm;
}

module.exports = {
  parseQueries,
};
