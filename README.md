# querystring-parser

Transforms CRUD-related querystrings into structured data.

```js
const querystringParser = require("@bitovi/querystring-parser");

const { page } = querystringParser.parse("page[number]=0&page[size]=10");
console.log(page.number); // --> 0
console.log(page.size); // --> 10
```

## Installation

If you are using `querystring-parser` with [Objection](https://vincit.github.io/objection.js/):

```sh
npm install @bitovi/objection-querystring-parser
```

If you are using `querystring-parser` with [Sequelize](https://sequelize.org):

```sh
npm install @bitovi/sequelize-querystring-parser
```

Otherwise:

```sh
npm install @bitovi/querystring-parser
```

## Next steps

- Read the [full documentation](https://github.com/bitovi/querystring-parser/tree/main/packages/querystring-parser#readme)
- Read the docs for ORM-specific versions
  - [Objection](https://github.com/bitovi/querystring-parser/tree/main/packages/objection#readme)
  - [Sequelize](https://github.com/bitovi/querystring-parser/tree/main/packages/sequelize#readme)

## Need help or have questions?

This project is supported by [Bitovi, a Nodejs consultancy](https://www.bitovi.com/backend-consulting/nodejs-consulting). You can get help or ask questions on our:

- [Slack Community](https://www.bitovi.com/community/slack)
- [Twitter](https://twitter.com/bitovi)

Or, you can hire us for training, consulting, or development. [Set up a free consultation.](https://www.bitovi.com/backend-consulting/nodejs-consulting)

## Development / Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)
