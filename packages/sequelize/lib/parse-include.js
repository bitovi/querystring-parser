function parseAttributes(attributes) {
  if (!attributes?.length) {
    return undefined;
  }

  if (!attributes.some((attribute) => attribute.startsWith("-"))) {
    return attributes;
  }

  return attributes.reduce(
    (acc, curr) =>
      curr.startsWith("-")
        ? { ...acc, exclude: [...(acc.exclude ?? []), curr.substr(1)] }
        : { ...acc, include: [...(acc.include ?? []), curr] },
    {},
  );
}

function parseInclude(includes, includeErrors, includeAttributes = {}) {
  if (includeErrors.length) {
    return { errors: includeErrors, results: {} };
  }

  if (!Array.isArray(includes)) {
    return { errors: ["Include field should be an array"], results: {} };
  }

  if (!includes.length) {
    return { errors: [], results: {} };
  }

  const attributes = parseAttributes(includeAttributes[""]);

  return {
    errors: [],
    results: {
      ...(attributes && { attributes }),
      include: constructIncludes(includes, includeAttributes),
    },
  };
}

function constructIncludes(includes, includeAttributes) {
  const result = [];

  for (let i = 0; i < includes.length; i++) {
    const include = includes[i].split(".");
    let current = result;

    for (let j = 0; j < include.length; j++) {
      const part = include[j];
      const existing = current.find((item) => item.association === part);

      if (existing) {
        current = existing.include;
      } else {
        const fullPath = include.slice(0, j + 1).join(".");
        const attributes = parseAttributes(includeAttributes[fullPath]);
        const newPart = {
          association: part,
          include: [],
          ...(attributes && { attributes }),
        };
        current.push(newPart);
        current = newPart.include;
      }
    }
  }

  return result;
}

module.exports = parseInclude;
