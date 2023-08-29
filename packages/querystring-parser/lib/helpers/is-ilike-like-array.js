/** Checks for like or ilike array in query string */

const iLikeLikeRegExp = new RegExp(/(\[\$like\]=\[|\[\$ilike\]=\[)/g);

function isIlikeLikeArray(querystring) {
  const matchingResults = querystring.match(iLikeLikeRegExp);
  if (matchingResults?.length) {
    return true;
  }
  return false;
}

module.exports = { isIlikeLikeArray, iLikeLikeRegExp };
