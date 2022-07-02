function parseParametersForObjection(operator, value) {
  return Array.isArray(value)
    ? value.length > 2
      ? [value[0], operator, value.slice(1)]
      : [value[0], operator, value[1]]
    : [value, operator];
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
        parsedArray = [...parsedArray, ...sortArrayFilters(filters["AND"])];
      } else if (key === "OR") {
        parsedArray = [
          ...parsedArray,
          ...sortArrayFilters(filters["OR"], true),
        ];
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

module.exports = parseFilters;
