const { Sequelize, DataTypes } = require("sequelize");
const HogwartsData = require("./data");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "hogwarts.db",
});

const Students = sequelize.define(
  "students",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userType: {
      type: DataTypes.ENUM(["Staff", "Student"]),
    },
    house: {
      type: DataTypes.ENUM([
        "Gryffindor",
        "Hufflepuff",
        "Ravenclaw",
        "Slytherin",
      ]),
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    date_registered: {
      type: DataTypes.DATE,
    },
  },
  {
    // Other model options go here
    timestamps: false,
  },
);

const Spells = sequelize.define(
  "spells",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Students,
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_casted: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: false,
  },
);

(async () => {
  try {
    //Create Relationship
    Students.hasMany(Spells, { foreignKey: "user_id", as: "spells" });
    Spells.belongsTo(Students, { foreignKey: "user_id", as: "student" });
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Database and Tables connected successfully");
    await seed();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

const seed = async () => {
  const students = await Students.findAll();
  if (students.length === 0) {
    await Students.bulkCreate(HogwartsData.students);
    await Spells.bulkCreate(HogwartsData.spells);
    console.log("Successfully added data to the table");
  }
};

module.exports = {
  Students,
};
