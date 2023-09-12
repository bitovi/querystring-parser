const {
  isAnArray,
  containsNoErrorFromParser,
} = require("../helpers/validation");
const { splitArray, mergeAlliance } = require("../helpers");

function parseInclude(include, includeErrors, includeAttributes = []) {
  const parsedArray = {};
  let errors = [];
  if (!containsNoErrorFromParser(includeErrors)) {
    errors = includeErrors;
  } else if (!isAnArray(include)) {
    errors.push("Include field should be an array");
  } else if (include.length > 0) {
    parsedArray.include = constructIncludes(include, includeAttributes);
  }

  return {
    results: parsedArray,
    errors,
  };
}

function constructIncludes(include) {
  const updatedincludes = [];
  const includeWithAlias = {};

  include.forEach((i) => {
    const splittedArray = splitArray(i);
    if (splittedArray.length === 1) {
      includeWithAlias[splittedArray[0]] = {
        association: splittedArray[0],
        alias: [],
        include: [],
      };
    } else {
      for (let index = 0; index < splittedArray.length - 1; index++) {
        const key = `${splittedArray.slice(0, index + 1).join(".")}`;
        const alias = `${splittedArray.slice(0, index + 2).join(".")}`;
        if (includeWithAlias[key]) {
          includeWithAlias[key].include =
            index + 1 === splittedArray.length - 1
              ? [
                  ...includeWithAlias[key].include,
                  { association: splittedArray[index + 1] },
                ]
              : includeWithAlias[key].include;
          includeWithAlias[key].alias =
            index + 1 === splittedArray.length - 1
              ? includeWithAlias[key].alias
              : Array.from(new Set([...includeWithAlias[key].alias, alias]));
        } else {
          includeWithAlias[key] = {
            association: splittedArray[index],
            ...(index + 1 === splittedArray.length - 1
              ? {
                  include: [
                    {
                      association: splittedArray[index + 1],
                    },
                  ],
                  alias: [],
                }
              : {
                  alias: [alias],
                  include: [],
                }),
          };
        }
      }
    }
  });

  const includeWithAliasKeys = Object.keys(includeWithAlias);

  includeWithAliasKeys.forEach((key) => {
    if (key.split(".").length === 1) {
      const { value } = mergeAlliance(
        includeWithAlias,
        key,
        // includedAttributes
      );
      updatedincludes.push(value);
    }
  });

  return updatedincludes;
}

module.exports = parseInclude;
