# querystring-parser

![Tests Workflow Status](https://github.com/bitovi/querystring-parser/actions/workflows/tests.yml/badge.svg?branch=main)
[![Join our Slack](https://img.shields.io/badge/slack-join%20chat-611f69.svg)](https://www.bitovi.com/community/slack?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

- [Why querystring-parser?](#why-querystring-parser)
- [Installation](#installation)
- [Usage](#usage)
  - [Sort Parameters](#sort-parameters)
  - [Pagination Parameters](#pagination-parameters)
  - [Include Parameters](#include-parameters)
  - [Fields Parameters](#fields-parameters)
  - [Filter Parameters](#filter-parameters)
  - [MongoDB-Style Filter Parameters](#mongodb-style-filter-parameters)
    - [Quick Examples](#quick-examples)
    - [MongoDB-Style Operators](#mongodb-style-operators)
    - [Omitted Operators](#omitted-operators)
    - [Arrays](#arrays)
    - [Compound Filters](#compound-filters)
  - [IBM-Style Filter Parameters](#ibm-style-filter-parameters)
    - [Quick Examples](#quick-examples-1)
    - [IBM-Style Operators](#ibm-style-operators)
    - [Attribute References](#attribute-references)
    - [Compound Filters](#compound-filters-1)
- [Development / Contributing](#development--contributing)
- [Home](https://github.com/bitovi/querystring-parser#readme)

## Why querystring-parser?

Consider the following situation:

- You're building a standard CRUD app that more-or-less follows the [JSON:API specification](https://jsonapi.org/format/)
- This app will receive HTTP GET requests with querystrings like those in the examples below:
  - `?filter[start_date][$gt]=2020-01-01`
  - `?sort=-date,name&page[number]=1&page[size]=5`
  - `?fields[articles]=title,body&fields[people]=name`
- You need to parse these query parameters to fetch the requested data. This library does the querystring parsing for you.

## Installation

```sh
npm install @bitovi/querystring-parser
```

If you plan to use this library with [Objection](https://vincit.github.io/objection.js/) or [Sequelize](https://sequelize.org), do not install `@bitovi/querystring-parser`. Instead, install either:

- [`@bitovi/objection-querystring-parser`](https://github.com/bitovi/querystring-parser/tree/main/packages/objection#readme)
- [`@bitovi/sequelize-querystring-parser`](https://github.com/bitovi/querystring-parser/tree/main/packages/sequelize#readme)

## Usage

```js
const querystringParser = require("@bitovi/querystring-parser");

const { page } = querystringParser.parse("page[number]=0&page[size]=10");
console.log(page.number); // --> 0
console.log(page.size); // --> 10
```

### Sort Parameters

The parsed results of the `sort` query parameters are stored in the `sort` property.
The value of the `sort` property is an array of "sort field" objects. Each "sort field" object includes a field name and a sort direction.

Reference: [JSON:API - Sorting](https://jsonapi.org/format/#fetching-sorting)

```js
const { sort } = querystringParser.parse("sort=-date,name");
console.log(sort[0]); // --> { field: 'date', direction: 'DESC' }
console.log(sort[1]); // --> { field: 'name', direction: 'ASC' }
```

### Pagination Parameters

The parsed results of the `page` query parameters are stored in the `page` property. The value of the `page` property is an object which has 2 keys: `number` and `size`.

Reference: [JSON:API - Pagination](https://jsonapi.org/format/#fetching-pagination)

```js
const { page } = querystringParser.parse("page[number]=0&page[size]=10");
console.log(page.number); // --> 0
console.log(page.size); // --> 10
```

### Include Parameters

The parsed results of the `include` query parameter is stored in the `include` property. The value of the `include` property is an array of "relationship paths".

Reference: [JSON:API - Inclusion of Related Resources](https://jsonapi.org/format/#fetching-includes)

```js
const { include } = querystringParser.parse(
  "include=children.movies.actors.children,children.movies.actors.pets,children.pets,pets"
);
console.log(include[0]); // --> 'children.movies.actors.children'
console.log(include[1]); // --> 'children.movies.actors.pets'
console.log(include[2]); // --> 'children.pets'
console.log(include[3]); // --> 'pets'
```

### Fields Parameters

The parsed results of the `fields[TYPE]` query parameters are stored in the `fields` property. The value of the `fields` property is an object. For each key-value pair in that object, the key is the name of a type and the value is an array of fields for that type.

Reference: [JSON:API - Sparse Fieldsets](https://jsonapi.org/format/#fetching-sparse-fieldsets)

```js
const { fields } = querystringParser.parse(
  "fields[articles]=title,body&fields[people]=name"
);
console.log(fields.articles); // --> [ 'title', 'body' ]
console.log(fields.people); // --> [ 'name' ]
```

### Filter Parameters

The parsed results of the `filter` query parameters are stored in the `filter` property. There are 2 "styles" of querystring filters that are supported. "MongoDB-Style" and "IBM-Style". Though they have their own conventions, they both produce the same kind of output. You can use both of these styles if you want, but not in the same querystring.

---

### MongoDB-Style Filter Parameters

The MongoDB-Style is based off of the [MongoDB comparison query operators](https://www.mongodb.com/docs/manual/reference/operator/query-comparison/).

#### Quick Examples

| Querystring Filter             | Parsed Output                            |
| ------------------------------ | ---------------------------------------- |
| filter[name]=brad              | `{ LIKE: [ '#name', '%brad%' ] }`        |
| filter[name][$eq]=mike         | `{ '=': [ '#name', 'mike' ] }`           |
| filter[age][$gt]=21            | `{ '>': [ '#age', 21 ] }`                |
| filter[born][$lte]=2020-01-01  | `{ '<=': [ '#born', '2020-01-01' ] }`    |
| filter[score][$eq]=null        | `{ 'IS NULL': '#score' }`                |
| filter[name][$in]=michael,brad | `{ IN: [ '#name', 'michael', 'brad' ] }` |

#### MongoDB-Style Operators

Below is the full list of MongoDB-Style operators and their compatible value types.

| Operator | strings | numbers | dates | nulls | arrays |
| -------- | :-----: | :-----: | :---: | :---: | :----: |
| $eq      |   ✅    |   ✅    |  ✅   |  ✅   |   ❌   |
| $ne      |   ✅    |   ✅    |  ✅   |  ✅   |   ❌   |
| $gt      |   ✅    |   ✅    |  ✅   |  ❌   |   ❌   |
| $gte     |   ✅    |   ✅    |  ✅   |  ❌   |   ❌   |
| $lt      |   ✅    |   ✅    |  ✅   |  ❌   |   ❌   |
| $lte     |   ✅    |   ✅    |  ✅   |  ❌   |   ❌   |
| ilike    |   ✅    |   ❌    |  ❌   |  ❌   |   ❌   |
| $in      |   ✅    |   ✅    |  ✅   |  ✅   |   ✅   |
| $nin     |   ✅    |   ✅    |  ✅   |  ✅   |   ✅   |

#### Omitted Operators

MongoDB-Style filters do not require explicit operators. In many cases, the value type is enough for the parser to infer which operator to use. The examples below demonstrate operator inference for each value type.

| Value Type | Example                 | Output                                |
| ---------- | ----------------------- | ------------------------------------- |
| string     | filter[name]=lisa       | `{ LIKE: [ '#name', '%lisa%' ] }`     |
| number     | filter[age]=25          | `{ '=': [ '#age', 25 ] }`             |
| date       | filter[born]=2020-01-01 | `{ '=': [ '#born', '2020-01-01' ] }`  |
| null       | filter[score]=null      | `{ 'IS NULL': '#score' }`             |
| array      | filter[name]=mike,brad  | `{ IN: [ '#name', 'mike', 'brad' ] }` |

#### Arrays

The following examples demonstrate how array values may be specified.

- Using repeating query params:
  - `filter[age][$in]=24&filter[age][$in]=25&filter[age][$in]=26`
- Using commas (`,`):
  - `filter[age][$in]=24,25,26`

Both styles will result in the same output:
`{ IN: [ '#age', 24, 25, 26 ] }`

#### Compound Filters

MongoDB-Style filters do not directly support higher-order operators (`AND` / `OR` / `NOT`). However, if multiple filters are present in the query string then they will be joined together in an `AND` fashion.

<!-- prettier-ignore -->
```js
// example of 2 filters getting "AND"-ed together into a compound filter
const { filter } = querystringParser.parse("filter[name]=mike&filter[age]=25");
expect(filter).toEqual({
  AND: [
    { LIKE: ["#name", "%mike%"] },
    { "=": ["#age", 25] }
  ]
});
```

---

### IBM-Style Filter Parameters

The IBM-Style is based off of the [jsonapi.net filtering specification](https://www.jsonapi.net/usage/reading/filtering.html).

#### Quick Examples

| Querystring Filter                                 | Parsed Output                                                     |
| -------------------------------------------------- | ----------------------------------------------------------------- |
| filter=contains(name,'brad')                       | `{ LIKE: [ '#name', '%brad%' ] }`                                 |
| filter=equals(name,'mike')                         | `{ '=': [ '#name', 'mike' ] }`                                    |
| filter=greaterThan(age,'25')                       | `{ '>': [ '#age', 25 ] }`                                         |
| filter=lessOrEqual(born,'2020-01-01')              | `{ '<=': [ '#born', '2020-01-01' ] }`                             |
| filter=any(name,'brad','mike')                     | `{ IN: [ '#name', 'brad', 'mike' ] }`                             |
| filter=equals(score,null)                          | `{ 'IS NULL': '#score' }`                                         |
| filter=not(equals(age,'25'))                       | `{ NOT: { "=": ["#age", 25] } }`                                  |
| filter=and(any(age,'10','20'),equals(name,'mike')) | `{ AND: [{ IN: ["#age", 10, 20] }, { "=": ["#name", "mike"] }] }` |
| filter=or(any(age,'10','20'),equals(name,'mike'))  | `{ OR: [{ IN: ["#age", 10, 20] }, { "=": ["#name", "mike"] }] }`  |

#### IBM-Style Operators

Below is the full list of IBM-Style operators and their compatible value types.

| Operator       | strings | numbers | dates | attribute refs | nulls | nested operators |
| -------------- | :-----: | :-----: | :---: | :------------: | :---: | :--------------: |
| equals         |   ✅    |   ✅    |  ✅   |       ✅       |  ✅   |        ❌        |
| greaterThan    |   ✅    |   ✅    |  ✅   |       ✅       |  ❌   |        ❌        |
| greaterOrEqual |   ✅    |   ✅    |  ✅   |       ✅       |  ❌   |        ❌        |
| lessThan       |   ✅    |   ✅    |  ✅   |       ✅       |  ❌   |        ❌        |
| lessOrEqual    |   ✅    |   ✅    |  ✅   |       ✅       |  ❌   |        ❌        |
| contains       |   ✅    |   ❌    |  ❌   |       ❌       |  ❌   |        ❌        |
| startsWith     |   ✅    |   ❌    |  ❌   |       ❌       |  ❌   |        ❌        |
| endsWith       |   ✅    |   ❌    |  ❌   |       ❌       |  ❌   |        ❌        |
| any            |   ✅    |   ✅    |  ✅   |       ❌       |  ✅   |        ❌        |
| not            |   ❌    |   ❌    |  ❌   |       ❌       |  ❌   |        ✅        |
| and            |   ❌    |   ❌    |  ❌   |       ❌       |  ❌   |        ✅        |
| or             |   ❌    |   ❌    |  ❌   |       ❌       |  ❌   |        ✅        |

#### Attribute References

Some of the IBM-Style operators can directly compare 2 different attributes (or "columns").
In the example below, `wins` and `losses` are attribute references (as opposed to constant values like `'emily'` or `'22'`).

By convention, attribute references are prefixed with a '#' in the parsed output to distinguish them from constant values.

```js
// example attribute references
const { filter } = querystringParser.parse("filter=greaterThan(wins,losses)");
expect(filter).toEqual({ ">": ["#wins", "#losses"] });
```

#### Compound Filters

IBM-Style filters directly support higher-order operators (`AND` / `OR` / `NOT`). On top of that, if multiple filters are present in the query string then they will be joined together in an `OR` fashion.

<!-- prettier-ignore -->
```js
// example of 2 filters getting "OR"-ed together into a compound filter
const { filter } = querystringParser.parse("filter=contains(name,'mike')&filter=equals(age,'25')");
expect(filter).toEqual({
  OR: [
    { LIKE: ["#name", "%mike%"] },
    { "=": ["#age", 25] }
  ]
});
```

## Development / Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)
