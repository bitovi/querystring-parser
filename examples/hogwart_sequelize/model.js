const { Sequelize, DataTypes } = require("sequelize");
const HogwartsData = require("./data");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "example.db",
});

const Hogwarts = sequelize.define(
  "hogwarts",
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
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Database and Tables connected successfully");
    await seed();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

const seed = async () => {
  const hogwartsData = await Hogwarts.findAll();
  if (hogwartsData.length === 0) {
    await Hogwarts.bulkCreate(HogwartsData);
    console.log("Successfully added data to the table");
  }
};

module.exports = {
  Hogwarts,
};
