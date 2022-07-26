# Hogwart example project using Objection

The project is a simple express server using sqlite as the database and Objection as an ORM. It shows how to use the objection-querystring-parser library to query your database from the client following the [JSON API](https://jsonapi.org/format/) specifications.

Note that this is not an example of how to build a web server or use objection. It's an example of how to use the objection-querystring-parser library in your project.

# Install and run

```sh
git clone git@github.com:bitovi/querystring-parser.git querystring
cd querystring/examples/hogwart_objection
npm install
npm start
```

# How to use

- Point your browser to `localhost:3000/students` to get started, it should return a list of all students seeded in the Database.
