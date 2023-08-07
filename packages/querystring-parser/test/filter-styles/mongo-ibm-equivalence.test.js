const parseMongoFilter = require("../../lib/filter-styles/parse-mongo-filter");
const parseIbmFilter = require("../../lib/filter-styles/parse-ibm-filter");

function testEachCase(testCases) {
  test.concurrent.each(testCases)(
    "$title",
    ({ mongoQueryString, ibmQueryString }) => {
      const { results: mongoResults } = parseMongoFilter(mongoQueryString);
      const { results: ibmResults } = parseIbmFilter(ibmQueryString);
      expect(mongoResults).toEqual(ibmResults);
    }
  );
}

describe("MongoDB-style filtering vs IBM-style filtering Equivalence Tests", () => {
  describe("value types", () => {
    testEachCase([
      {
        title: "both styles should output string values the same way",
        mongoQueryString: "filter[name][$eq]=michael",
        ibmQueryString: "filter=equals(name,'michael')",
      },
      {
        title: "both styles should output number values the same way",
        mongoQueryString: "filter[age][$eq]=25",
        ibmQueryString: "filter=equals(age,'25')",
      },
      {
        title: "both styles should output date values the same way",
        mongoQueryString: "filter[born][$eq]=2020-01-01",
        ibmQueryString: "filter=equals(born,'2020-01-01')",
      },
      {
        title: "both styles should output null values the same way",
        mongoQueryString: "filter[born][$eq]=null",
        ibmQueryString: "filter=equals(born,null)",
      },
    ]);
  });
  describe("operators", () => {
    testEachCase([
      {
        title: 'both styles should output the "=" sql operator the same way',
        mongoQueryString: "filter[name][$eq]=michael",
        ibmQueryString: "filter=equals(name,'michael')",
      },
      {
        title: 'both styles should output the ">" sql operator the same way',
        mongoQueryString: "filter[name][$gt]=michael",
        ibmQueryString: "filter=greaterThan(name,'michael')",
      },
      {
        title: 'both styles should output the ">=" sql operator the same way',
        mongoQueryString: "filter[name][$gte]=michael",
        ibmQueryString: "filter=greaterOrEqual(name,'michael')",
      },
      {
        title: 'both styles should output the "<" sql operator the same way',
        mongoQueryString: "filter[name][$lt]=michael",
        ibmQueryString: "filter=lessThan(name,'michael')",
      },
      {
        title: 'both styles should output the "<=" sql operator the same way',
        mongoQueryString: "filter[name][$lte]=michael",
        ibmQueryString: "filter=lessOrEqual(name,'michael')",
      },
      {
        title: 'both styles should output the "LIKE" sql operator the same way',
        mongoQueryString: `filter[name][$like]=${encodeURIComponent("%ch%")}`,
        ibmQueryString: "filter=contains(name,'ch')",
      },
      {
        title: 'both styles should output the "IN" sql operator the same way',
        mongoQueryString: "filter[name][$in]=michael,brad",
        ibmQueryString: "filter=any(name,'michael','brad')",
      },
    ]);
  });
});
