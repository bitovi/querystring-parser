const parseFields = require("../lib/parse-fields");

describe("parseFields", () => {
  const testCases = [
    {
      title: "should return fields for multiple types",
      querystring: "fields[articles]=title,body&fields[people]=name",
      expectedResults: {
        articles: ["title", "body"],
        people: ["name"],
      },
    },
    {
      title: "should not include empty strings as fields",
      querystring: "fields[articles]=",
      expectedResults: {
        articles: [],
      },
    },
    {
      title: "should default to empty object if no fields were specified",
      querystring: "filter[name]=michael",
      expectedResults: {},
    },

    /**
     * Alternate querystring formats
     */
    {
      title:
        "should return combined fields for types that are specified more than once",
      querystring: "fields[articles]=a&fields[articles]=b&fields[articles]=",
      expectedResults: {
        articles: ["a", "b"],
      },
    },

    /**
     * Query String Missing
     */
    {
      title: "should return empty object when querystring is empty string",
      querystring: "",
      expectedResults: {},
    },
    {
      title: "should return empty object when querystring is null",
      querystring: null,
      expectedResults: {},
    },
    {
      title: "should return empty object when querystring is undefined",
      querystring: undefined,
      expectedResults: {},
    },

    /**
     * Errors
     */
    {
      title: "should return error if type was not specified",
      querystring: "fields[articles]=title,body&fields=name",
      expectedResults: {
        articles: ["title", "body"],
      },
      expectedErrors: [
        new Error(
          "Incorrect format for fields in querystring: 'fields[articles]=title,body&fields=name'"
        ),
      ],
    },
    {
      title:
        "should return error if type has duplicate fields, and remove the duplicate fields",
      querystring:
        "fields[cats]=name,name&fields[dogs]=name&fields[dogs]=name&fields[snakes]=name",
      expectedResults: {
        cats: ["name"],
        dogs: ["name"],
        snakes: ["name"],
      },
      expectedErrors: [
        new Error(
          "Duplicated field 'name' for type 'cats' detected in querystring: 'fields[cats]=name,name&fields[dogs]=name&fields[dogs]=name&fields[snakes]=name'"
        ),
        new Error(
          "Duplicated field 'name' for type 'dogs' detected in querystring: 'fields[cats]=name,name&fields[dogs]=name&fields[dogs]=name&fields[snakes]=name'"
        ),
      ],
    },
  ];

  test.concurrent.each(testCases)(
    "$title",
    ({ querystring, expectedResults, expectedErrors }) => {
      const { results, errors } = parseFields(querystring);
      expect(results).toEqual(expectedResults);
      expect(errors).toEqual(expectedErrors || []);
    }
  );
});
