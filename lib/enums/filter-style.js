/** An enumeration of filter styles that this library can parse from a querystring. */
const FilterStyle = Object.freeze({
  MONGO_DB: Symbol("MONGO_DB"),
  IBM: Symbol("IBM"),
});

module.exports = FilterStyle;
