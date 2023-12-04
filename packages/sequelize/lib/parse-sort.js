function parseSort(sort, sortError) {
  const parsedResult = {};
  let errors = [];
  if (sortError.length) {
    errors = sortError;
  } else if (!Array.isArray(sort)) {
    errors.push("Sort field should be an array");
  } else if (sort.length > 0) {
    const newSortFields = sort.map((field) => [
      ...field.field.split("."),
      field.direction,
    ]);
    parsedResult.order = newSortFields;
  }

  return {
    results: parsedResult,
    errors,
  };
}

module.exports = parseSort;
