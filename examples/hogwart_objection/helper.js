const lib = require("../../packages/objection/index");


const libResult = [
  {
    fx: 'where',
    parameters: [
      function () {
        this.where('id', '=', '1') // OR subexpression a
        .orWhere(function () { // OR subexpression b
          this.where('id', '=', '2') // AND subexpression a
          .where('id', '>', '0') // AND subexpression b
        }) 
      }
    ]
  }
]

const fetchQuery = async (queryString, model) => {
  const query = model.query();
  if (queryString) {
    const { data, errors } = lib.parse(queryString);
    console.log(data);
    if (errors.length > 0) {
      throw new Error(errors[0]);
    }
    // for (let d of data) {
    for (let d of libResult) {
      query[d.fx](...d.parameters);
    }
  }
  const queryData = await query;
  return queryData;
};

module.exports = {
  fetchQuery,
};
