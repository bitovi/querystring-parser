# sequelize-querystring-parser

This library builds on top of [`@bitovi/querystring-parser`](https://github.com/bitovi/querystring-parser/tree/main/packages/querystring-parser#readme) to transform CRUD-related querystrings into structured data for the [Sequelize ORM](https://sequelize.org).

- [Installation](#installation)
- [Usage](#usage)
  - [Sort Parameters](#sort-parameters)
  - [Pagination Parameters](#pagination-parameters)
  - [Fields Parameters](#fields-parameters)
  - [Include Parameters](#include-parameters)
  - [Filter Parameters](#filter-parameters)
- [Home](https://github.com/bitovi/querystring-parser#readme)

## Installation

```sh
npm install @bitovi/sequelize-querystring-parser
```

If you do not plan to use this library with Sequelize, please install [`@bitovi/querystring-parser`](https://github.com/bitovi/querystring-parser/tree/main/packages/querystring-parser#readme).

## Usage

```js
const querystringParser = require("@bitovi/sequelize-querystring-parser");
```

### Sort Parameters

Reference: [JSON:API - Sorting](https://jsonapi.org/format/#fetching-sorting)

```js
const result = querystringParser.parse("sort=-date,name");
console.log(result);
// {
//   orm: "sequelize",
//   data: {
//     order: [["date", "DESC"],["name","ASC"]]
//  },
//   errors: [],
// };
```

### Pagination Parameters

Reference: [JSON:API - Pagination](https://jsonapi.org/format/#fetching-pagination)

```js
const result = querystringParser.parse("page[number]=1&page[size]=10");
console.log(result);
// {
//   orm: "sequelize",
//   data: {
//     offset: 0,
//     limit: 10
//  },
//   errors: []
// };
```

### Fields Parameters

Reference: [JSON:API - Inclusion of Related Resources](https://jsonapi.org/format/#fetching-sparse-fieldsets)

```js
const result = querystringParser.parse("fields[people]=id,name");
console.log(result);
// {
//   orm: "sequelize",
//   data: {
//     attributes: ["id","name"]
//  },
//   errors: []
// };
```

### Include Parameters

Reference: [JSON:API - Inclusion of Related Resources](https://jsonapi.org/format/#fetching-includes)

```js
const result = querystringParser.parse("include=pets,dogs");
console.log(result);
// {
//   orm: "sequelize",
//   data: {
//     include: [
//       { association: "pets", include: [] },
//       { association: "dogs", include: [] }
//     ]
//  },
//   errors: []
// };
```

### Filter Parameters

```js
const result = querystringParser.parse("filter=and(any('age','10','20'),equals('name','mike'))");
console.log(result);
// {
//   orm: "sequelize",
//   data: {
//     where: {
//       [Symbol(and)] : [
//         {
//           age: {
//             [Symbol(in)]: [10, 20]
//           }
//         },
//         {
//           name: {
//             [Symbol(eq)]: "mike"
//           }
//         }
//       ]
//     }
//  },
//   errors: []
// };
```

**Note**: Database Validations should be done before or after passing the query to the library before the database call is made.

**Note**: The `Symbol()` calls use the [`Op` imported from the Sequelize library](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/), not the [Javascript Symbol class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol).

## Example

A more practical example on how to use this library in your project can be found [here](https://github.com/bitovi/querystring-parser/tree/main/examples)

## Further Documentation

This library builds on [`@bitovi/querystring-parser`](https://github.com/bitovi/querystring-parser/tree/main/packages/querystring-parser#readme). See its [documentation](https://github.com/bitovi/querystring-parser/tree/main/packages/querystring-parser#readme) for more on using `querystring-parser`.
