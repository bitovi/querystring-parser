# objection-querystring-parser

This library builds on top of [`@bitovi/querystring-parser`](https://github.com/bitovi/querystring-parser/tree/main/packages/querystring-parser#readme) to transform CRUD-related querystrings into structured data for the [Objection ORM](https://vincit.github.io/objection.js/).

- [objection-querystring-parser](#objection-querystring-parser)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Sort Parameters](#sort-parameters)
    - [Pagination Parameters](#pagination-parameters)
    - [Fields Parameters](#fields-parameters)
    - [Include Parameters](#include-parameters)
    - [Filter Parameters](#filter-parameters)
  - [Example](#example)
  - [Further Documentation](#further-documentation)
- [Home](https://github.com/bitovi/querystring-parser#readme)

## Installation

```sh
npm install @bitovi/objection-querystring-parser
```

If you do not plan to use this library with Objection, please install [`@bitovi/querystring-parser`](https://github.com/bitovi/querystring-parser/tree/main/packages/querystring-parser#readme).

## Usage

- This parser returns an array of results that can be chained together
- Each result is an object that contains an `fx`, `isNested` and a `parameters` key in the format { fx: 'limit', isNested: false, parameters: [10] }
- `fx` is the name of the function to be chained to the query
- `isNested` is a boolean that indicates if a Query is Nested(AND, OR, NOT).
- `parameters` where `isNested` is true is an array of results each with its own `fx`, `isNested` and `parameters`.
- `parameters` where `isNested` is false is an array of parameters to be added to the function `fx`, the parameters value is an array that you would spread into your function `fx`.
- The results are used in the format `Query[fx1](...parameters1)[fx2](...parameters2)`.
- This is better shown with an example [here](https://github.com/bitovi/querystring-parser/tree/main/examples).

```js
const querystringParser = require("@bitovi/objection-querystring-parser");
```

### Sort Parameters

Reference: [JSON:API - Sorting](https://jsonapi.org/format/#fetching-sorting)

```js
const result = querystringParser.parse("sort=-date,name");
console.log(result);
{
  orm: "objection",
  data: [
    {
      fx: "orderBy",
      parameters: [[
        { column: "date", order: "DESC" },
        { column: "name", order: "ASC" },
      ]],
    }
  ],
  errors: [],
};
```

### Pagination Parameters

Reference: [JSON:API - Pagination](https://jsonapi.org/format/#fetching-pagination)

```js
const result = querystringParser.parse("page[number]=0&page[size]=10");
console.log(result);
{
  orm: "objection",
  data: [
    [
      {
        fx: "offset",
        isNested: false,
        parameters: [0],
      },
      {
        fx: "limit",
        isNested: false,
        parameters: [10],
      },
    ],
  ],
  errors: [],
};
```

### Fields Parameters

Reference: [JSON:API - Inclusion of Related Resources](https://jsonapi.org/format/#fetching-sparse-fieldsets)

```js
const result = querystringParser.parse("fields[people]=id,name");
console.log(result);
{
  orm: "objection",
  data: [
    [
      {
        fx: "select",
        isNested: false,
        parameters: ["id","name"],
      },
    ],
  ],
  errors: [],
};
```

### Include Parameters

Reference: [JSON:API - Inclusion of Related Resources](https://jsonapi.org/format/#fetching-includes)

```js
const result = querystringParser.parse("include=pets,dogs");
console.log(result);
{
  orm: "objection",
  data: [
    [
      {
        fx: "withGraphFetched",
        isNested: false,
        parameters: ["pets", "dogs"],
      },
    ],
  ],
  errors: [],
};
```

### Filter Parameters

```js
const result = querystringParser.parse(
  "filter=or(any(age,'10','20'),equals(name,'mike'))"
);
{
  orm: "objection",
  data: [
    {
      fx: "where",
      isNested: true,
      parameters: [
        {
          fx: "whereIn",
          isNested: false,
          parameters: ["age", [10, 20]],
        },
        {
          fx: "orWhere",
          parameters: ["name", "=", "mike"],
        },
      ],
    },
  ],
  errors: [],
};
```

```js
const result = querystringParser.parse(
  "filter=not(lessOrEqual(age,'10'),equals(name,null))"
);
{
  orm: "objection",
  data: [
    {
      fx: "whereNot",
      isNested: true,
      parameters: [
        {
          fx: "where",
          isNested: false,
          parameters: ["age", "<=", 10],
        },
        {
          fx: "whereNull",
          parameters: ["name"],
        },
      ],
    },
  ],
  errors: [],
};
```

**Note**: Database Validations should be done before or after passing the query to the library before the database call is made.

## Example

A more practical example on how to use this library in your project can be found [here](https://github.com/bitovi/querystring-parser/tree/main/examples).

## Further Documentation

This library builds on [`@bitovi/querystring-parser`](https://github.com/bitovi/querystring-parser/tree/main/packages/querystring-parser#readme). See its [documentation](https://github.com/bitovi/querystring-parser/tree/main/packages/querystring-parser#readme) for more on using `querystring-parser`.
