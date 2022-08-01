## objection-querystring-parser

Consider the following situation:

- You're building a standard CRUD app that more-or-less follows the [JSON:API specification](https://jsonapi.org/format/)
- This app will receive HTTP GET requests with querystrings like those in the examples below:
  - `?filter[start_date][$gt]=2020-01-01`
  - `?sort=-date,name&page[number]=1&page[size]=5`
  - `?fields[articles]=title,body&fields[people]=name`
- You need to parse these query parameters to fetch the requested data. This library transforms CRUD-related querystrings into structured data for the Objection ORM.

## Installation

```sh
npm install @bitovi/objection-querystring-parser --save
```

## Usage

- This parser returns an array of results that can be chained together
- Each result is an object that contains an `fx` and a `parameters` key in the format { fx: 'limit', parameters: [10] }
- `fx` is the name of the function to be chained to the query
- `parameters` are the parameters to be added to the function, the parameters value is an array that you can spread into your function
- In the format `Query[fx1](...parameters1)[fx2](...parameters2)`.

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
        parameters: [0],
      },
      {
        fx: "limit",
        parameters: [10],
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
        fx: "select",
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
  "filter=or(any('age','10','20'),equals('name','mike'))"
);
{
  orm: "objection",
  data: [
    {
      fx: "where",
      parameters: ["age", "IN", [10, 20]],
    },
    {
      fx: "orWhere",
      parameters: ["name", "=", "mike"],
    },
  ],
  errors: [],
};
```

## Example

- A more practical example on how to use this library in your project can be found [here](https://github.com/bitovi/querystring-parser/tree/main/examples)
