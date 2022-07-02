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

module.exports = parsePagination;
