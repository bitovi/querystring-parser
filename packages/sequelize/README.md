## sequelize-querystring-parser

Consider the following situation:

- You're building a standard CRUD app that more-or-less follows the [JSON:API specification](https://jsonapi.org/format/)
- This app will receive HTTP GET requests with querystrings like those in the examples below:
  - `?filter[start_date][$gt]=2020-01-01`
  - `?sort=-date,name&page[number]=1&page[size]=5`
  - `?fields[articles]=title,body&fields[people]=name`
- You need to parse these query parameters to fetch the requested data. This library transforms CRUD-related querystrings into structured data for the Sequelize ORM.

## Installation

```sh
npm install @bitovi/sequelize-querystring-parser --save
```

## Usage

```js
const querystringParser = require("@bitovi/sequelize-querystring-parser");
```

### Sort Parameters

Reference: [JSON:API - Sorting](https://jsonapi.org/format/#fetching-sorting)

```js
const result = querystringParser.parse("sort=-date,name");
console.log(result);
{
  orm: "sequelize",
  data: {
    order: [["date", "DESC"],["name","ASC"]]
 },
  errors: [],
};
```

### Pagination Parameters

Reference: [JSON:API - Pagination](https://jsonapi.org/format/#fetching-pagination)

```js
const result = querystringParser.parse("page[number]=0&page[size]=10");
console.log(result);
{
  orm: "sequelize",
  data: {
    offset: 0,
    limit: 10
 },
  errors: []
};
```

### Fields Parameters

Reference: [JSON:API - Inclusion of Related Resources](https://jsonapi.org/format/#fetching-sparse-fieldsets)

```js
const result = querystringParser.parse("fields[people]=id,name");
console.log(result);
{
  orm: "sequelize",
  data: {
    attributes: ["id","name"]
 },
  errors: []
};
```

### Include Parameters

Reference: [JSON:API - Inclusion of Related Resources](https://jsonapi.org/format/#fetching-includes)

```js
const result = querystringParser.parse("include=pets,dogs");
console.log(result);
{
  orm: "sequelize",
  data: {
    include: ["pets","dogs"]
 },
  errors: []
};
```

### Filter Parameters

```js
const result = querystringParser.parse(
  "filter=and(any('age','10','20'),equals('name','mike'))"
);
{
  orm: "sequelize",
  data: {
    where: {
      [Symbol(and)] : {
        [Symbol(any)]: {
          age: [10, 20]
        },
        [Symbol(eq)]: {
          name: 'mike'
        }
      }
    }
 },
  errors: []
};
```

** Note: Database Validations should be done before or after passing the query to the library before the database call is made. **

** Note: The Symbol(\*) uses the Op imported from the Sequelize library, it is not a direct Javascript Symbol operator. **

## Example

- A more practical example on how to use this library in your project can be found in the [here](https://github.com/bitovi/querystring-parser/tree/main/examples)
