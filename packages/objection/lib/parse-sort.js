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

module.exports = parseSort;
