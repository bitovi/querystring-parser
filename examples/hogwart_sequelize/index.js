const express = require("express");
const dotenv = require("dotenv");
const url = require("url");
const cors = require("cors");
const { Hogwarts } = require("./model");
const lib = require("@bitovi/querystring-parser");

//configurations
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//code required to make query work..
const fetchQuery = async (query) => {
  let orm = {};
  if (query) {
    const { data, errors } = lib.parse(query);
    if (errors.length > 0) {
      throw new Error(errors[0]);
    }
    orm = data;
  }
  const hogwart = await Hogwarts.findAll(orm);
  return hogwart;
};

app.get("/students", async (req, res) => {
  try {
    //turn query to a raw string
    const query = url.parse(req.url).query;
    const students = await fetchQuery(query);
    res.status(200).json({
      data: students,
    });
  } catch (error) {
    console.log(error);
    //ensure to use a proper error handler
    //this is to handle error for just one endpoint
    res.status(500).json({
      errors: error.message,
    });
  }
});

app.listen(port, () => console.log(`Server is listening on port ${port}!`));

process.on("unhandledRejection", (err) => {
  console.error(err);
});

process.on("uncaughtException", (err) => {
  console.error(err.message);
});
