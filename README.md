# querystring-parser

Transforms CRUD-related querystrings into structured data

![Tests Workflow Status](https://github.com/bitovi/querystring-parser/actions/workflows/tests.yml/badge.svg?branch=main)
[![Join our Slack](https://img.shields.io/badge/slack-join%20chat-611f69.svg)](https://www.bitovi.com/community/slack?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

- [Why querystring-parser?](#why-querystring-parser)
- [Installation](#installation)
- [Usage](#usage)
  - [Sort Parameters](#sort-parameters)
  - [Pagination Parameters](#pagination-parameters)
  - [Include Parameters](#include-parameters)
  - [Fields Parameters](#fields-parameters)
  - [Filter Parameters](#fields-parameters)
    - [MongoDB-style Filter Parameters](#mongodb-style-filter-parameters)
    - [IBM-style Filter Parameters](#ibm-style-filter-parameters)

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
npm install @bitovi/querystring-parser --save
```

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

The parsed results of the `filter` query parameters are stored in the `filter` property. There are 2 "styles" of querystring filters that are supported. "MongoDB-style" and "IBM-style". Though they have their own conventions, they both produce the same kind of output.

#### MongoDB-style Filter Parameters

```js
const { filter } = querystringParser.parse(
  "filter[start_date][$eq]=2020-01-01"
);
console.log(filter); // --> { '=': ['#start_date', '2020-01-01'] }
```

The MongoDB-style is based off of the [MongoDB comparison query operators](https://www.mongodb.com/docs/manual/reference/operator/query-comparison/).

#### IBM-style Filter Parameters

```js
const { filter } = querystringParser.parse(
  "filter=equals(start_date,'2020-01-01'"
);
console.log(filter); // --> { '=': ['#start_date', '2020-01-01'] }
```

The IBM-style is based off of the [jsonapi.net filtering specification](https://www.jsonapi.net/usage/reading/filtering.html).

You can use both of these styles if you want, but not in the same querystring.

## Development / Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)
