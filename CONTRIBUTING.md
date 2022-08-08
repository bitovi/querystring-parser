## Lerna Monorepo
This repository is organized as a [Lerna](https://lerna.js.org/) monorepo which publishes multiple packages to npm.

## Testing

This project uses [jest](https://jestjs.io/) for unit testing.

### Run all tests

You can run tests for all lerna packages from the root directory (see [/package.json](/package.json)):
``` sh
npm run test
```

### Run package-specific tests

You can run tests for a specific package from the root directory like this:
``` sh
npm run test -- --scope=@bitovi/objection-querystring-parser
```

Or, you can navigate to a specific package direcotry:
``` sh
cd packages/objection
# run all tests in package:
npm run test
# run and watch for changes:
npm run test:watch
# run tests in specific file
npm run test -- parse-fields.test.js
```

## Linting / Code Style
Linting and code styles are enforced globally for this project (not package-specific).

Linting is handled by [eslint](https://eslint.org/). See the `lint*` scripts in [/package.json](/package.json).

Code Styles are enforced by [prettier](https://prettier.io/). See the `pretty*` scripts in [/package.json](/package.json).

## IDE / Editor

This package includes some quality-of-life configurations for Visual Studio Code, but it's not required.

## Release
1. Checkout `main` and pull latest changes:
``` sh
git checkout main
git pull origin main
```
2. Navigate to the repository root and use the npm script in [/package.json](/package.json):
``` sh
npm run publish
```
3. Follow the prompts from lerna to select a new version for each package
4. Confirm `y` that you want to publish these packages
5. Confirm that tags were pushed to github and packages were published to npm
6. [Document release in github](https://github.com/bitovi/querystring-parser/releases)


