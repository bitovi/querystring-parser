# querystring-parser

Transforms CRUD-related querystrings into structured data

![Tests Workflow Status](https://github.com/bitovi/querystring-parser/actions/workflows/tests.yml/badge.svg?branch=main)
[![Join our Slack](https://img.shields.io/badge/slack-join%20chat-611f69.svg)](https://www.bitovi.com/community/slack?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

- [Why querystring-parser?](#why-querystring-parser)
- [Installation](#installation)
- [Usage](#usage)
- [Development / Contributing](#development--contributing)

## Why querystring-parser?

Consider the following situation:

- You're building a standard CRUD app that more-or-less follows the [JSON:API specification](https://jsonapi.org/format/)
- This app will receive HTTP GET requests with querystrings like those in the examples below:
  - `?filter[start_date][$gt]=2020-01-01`
  - `?sort=-date,name&page[number]=1&page[size]=5`
  - `?fields[articles]=title,body&fields[people]=name`
- You need to parse these query parameters to fetch the requested data. This library does the querystring parsing for you.

## Installation

Depending on your use-case and the ORM in your project, you can install our various packages using

```sh
npm install @bitovi/querystring-parser --save
npm install @bitovi/objection-querystring-parser --save
npm install @bitovi/sequelize-querystring-parser --save
```

## Usage

```js
const querystringParser = require("@bitovi/querystring-parser");

const { page } = querystringParser.parse("page[number]=0&page[size]=10");
console.log(page.number); // --> 0
console.log(page.size); // --> 10
```

## Development / Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)
