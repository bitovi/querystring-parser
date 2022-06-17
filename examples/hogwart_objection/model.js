// run the following command to install:
// npm install objection knex

const { Model } = require('objection');
const Knex = require('knex');
const data = require('./data');


// Initialize knex.
const knex = Knex({
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: './example.db',
  },
  pool: {
    afterCreate: (conn, cb) => {
      conn.run('PRAGMA foreign_keys = ON', cb)
    },
  },
});

// Give the knex instance to objection.
Model.knex(knex);

// Person model.
class Hogwarts extends Model {
  static get tableName() {
    return 'hogwarts';
  }
}

async function createSchema() {
  if (await knex.schema.hasTable('hogwarts')) {
    console.log('Database connected');
    return;
  }

  // Create database schema. You should use knex migration files
  // to do this. We create it here for simplicity.
  await knex.schema.createTable('hogwarts', table => {
    table.increments('id').primary();
    table.string('name');
    table.enu('userType',['Staff','Student']);
    table.enu('house',['Gryffindor','Hufflepuff','Ravenclaw','Slytherin']);
    table.integer('points').defaultTo(0);
    table.date('date_registered');
  });

  //add the seed data immediately after the schema is created.
  await seed();
}

async function seed() {
  // Create some students.
   await Hogwarts.query().insertGraph(data);
}

createSchema()
  .catch(err => {
    console.error(err);
    return knex.destroy();
  });

module.exports = {
    Hogwarts
};