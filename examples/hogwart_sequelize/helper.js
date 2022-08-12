const lib = require("../../packages/sequelize/index");

const fetchQuery = async (query, model) => {
  let orm = {};
  if (query) {
    const { data, errors } = lib.parse(query);
    if (errors.length > 0) {
      throw new Error(errors[0]);
    }
    orm = data;
  }
  const results = await model.findAll(orm);
  return results;
};

module.exports = {
  fetchQuery,
};
