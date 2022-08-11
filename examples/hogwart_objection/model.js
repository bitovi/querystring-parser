// run the following command to install:
// npm install objection knex

const { Model } = require("objection");
const Knex = require("knex");
const hogwartsData = require("./data");

// Initialize knex.
const knex = Knex({
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: "./hogwarts2.db",
  },
  pool: {
    afterCreate: (conn, cb) => {
      conn.run("PRAGMA foreign_keys = ON", cb);
    },
  },
});

// Give the knex instance to objection.
Model.knex(knex);

//Models
class Students extends Model {
  static get tableName() {
    return "students";
  }

  static get relationMappings() {
    return {
      spells: {
        relation: Model.HasManyRelation,
        modelClass: Spells,
        join: {
          from: "students.id",
          to: "spells.user_id",
        },
      },
    };
  }
}

class Spells extends Model {
  static get tableName() {
    return "spells";
  }

  static get relationMappings() {
    return {
      student: {
        relation: Model.BelongsToOneRelation,
        modelClass: Students,
        join: {
          from: "spells.user_id",
          to: "students.id",
        },
      },
    };
  }
}

async function createSchema() {
  if (await knex.schema.hasTable("students")) {
    return;
  }

  // Create database schema. You should use knex migration files
  // to do this. We create it here for simplicity.
  await knex.schema.createTable("students", (table) => {
    table.increments("id").primary();
    table.string("name");
    table.enu("userType", ["Staff", "Student"]);
    table.enu("house", ["Gryffindor", "Hufflepuff", "Ravenclaw", "Slytherin"]);
    table.integer("points").defaultTo(0);
    table.date("date_registered");
  });

  await knex.schema.createTable("spells", (table) => {
    table.increments("id").primary();
    table.integer("user_id");
    table.string("title");
    table.date("date_casted");
  });

  //add the seed data immediately after the schema is created.
  await seed();
  console.log("Data successfully added");
}

async function seed() {
  // Create some students.
  await Students.query().insertGraph(hogwartsData.students);
  await Spells.query().insertGraph(hogwartsData.spells);
}

createSchema()
  .then(() => console.log("Database connected"))
  .catch((err) => {
    console.error(err);
    return knex.destroy();
  });

module.exports = {
  Students,
  Spells,
};
