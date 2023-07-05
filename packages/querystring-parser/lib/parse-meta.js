const qs = require("qs");
const isNonEmptyString = require("./helpers/is-non-empty-string");

function parseMeta(querystring) {
  const { meta } = qs.parse(querystring);

  return {
    results: meta ? meta.split(",").filter(isNonEmptyString) : [],
    errors: [],
  };
}
module.exports = parseMeta;
