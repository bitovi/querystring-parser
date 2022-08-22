const lib = require("../../packages/objection/index");

const fetchQuery = async (queryString, model) => {
  const query = model.query();
  if (queryString) {
    const { data, errors } = lib.parse(queryString);
    if (errors.length > 0) {
      throw new Error(errors[0]);
    }
    for (let d of data) {
      query[d.fx](...d.parameters);
    }
  }
  const queryData = await query;
  return queryData;
};

module.exports = {
  fetchQuery,
};
