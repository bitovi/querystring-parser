function mergeAlliance(includeWithAlias, key, includedAttributes) {
  if (includeWithAlias[key].alias.length > 0) {
    let updatedIncludeWithAlias = includeWithAlias;
    includeWithAlias[key].alias.forEach((alias) => {
      const { value, updatedAlias } = mergeAlliance(
        updatedIncludeWithAlias,
        alias,
        includedAttributes
      );
      updatedAlias[key].include = [...updatedAlias[key].include, value];
      updatedIncludeWithAlias = updatedAlias;
    });
    // updatedAlias
    if (includedAttributes[key]) {
      updatedIncludeWithAlias[key].atrributes = includedAttributes[key];
    }
    delete updatedIncludeWithAlias[key].alias;
    return {
      value: updatedIncludeWithAlias[key],
      updatedAlias: updatedIncludeWithAlias,
    };
  } else {
    const value = includeWithAlias[key];
    if (includedAttributes[key]) {
      includeWithAlias[key].attributes = includedAttributes[key];
    }
    const keyIncludes = includeWithAlias[key].include.map((i) => {
      const includeKey = `${key}.${i.model}`;
      if (includedAttributes[includeKey]) {
        return {
          ...i,
          attributes: includedAttributes[includeKey],
        };
      }
      return i;
    });
    includeWithAlias[key].include = keyIncludes;
    delete includeWithAlias[key].alias;
    return {
      value,
      updatedAlias: includeWithAlias,
    };
  }
}

function splitArray(arr) {
  const splittedArray = arr.split(".");
  return splittedArray;
}

module.exports = {
  splitArray,
  mergeAlliance,
};
