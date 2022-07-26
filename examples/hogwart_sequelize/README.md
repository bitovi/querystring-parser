# Hogwart example project using Sequelize

The project is a simple express server using sqlite as the database and sequelize as an ORM. It shows how to use the sequelize-querystring-parser library to query your database from the client following the [JSON API](https://jsonapi.org/format/) specifications.

Note that this is not an example of how to build a web server or use sequelize. It's an example of how to use the sequelize-querystring-parser library in your project.

# Install and run

```sh
git clone git@github.com:bitovi/querystring-parser.git querystring
cd querystring/examples/hogwart_sequelize
npm install
npm start
```

# How to use

- Point your browser to `localhost:3000/students` to get started, it should return a list of all students seeded in the Database.
