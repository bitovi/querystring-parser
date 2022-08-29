const lib = require("../../packages/objection/index");

function handleQuery(query, data) {
  for (let d of data) {
    if (d.isNested) {
      query[d.fx](function () {
        handleQuery(this, d.parameters);
      });
    } else {
      query[d.fx](...d.parameters);
    }
  }
  return query;
}

const fetchQuery = async (queryString, model) => {
  //Proper database validations to check the query should be done before passing the query to the library.
  let query = model.query();
  if (queryString) {
    const { data, errors } = lib.parse(queryString);
    if (errors.length > 0) {
      throw new Error(errors[0]);
    }
    query = handleQuery(query, data);
  }
  const queryData = await query;
  return queryData;
};

module.exports = {
  fetchQuery,
};
