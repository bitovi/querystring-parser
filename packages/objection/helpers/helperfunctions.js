function removeHashFromString(str) {
  return str?.replace("#", "");
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function convertToOrFormat(str) {
  const capStr = capitalizeFirstLetter(str);
  return `or${capStr}`;
}

module.exports = {
  removeHashFromString,
  convertToOrFormat,
};
