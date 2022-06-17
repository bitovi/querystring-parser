const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { Hogwarts } = require("./model");
const { parseQueries } = require("./query-parser");

//configurations
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const fetchAllExamples = async (query) => {
  const orm = parseQueries(query);
  const hogwart = Hogwarts.query();
  for (let q of orm) {
    hogwart[q.fx](...q.parameters);
  }
  const queryData = await hogwart;
  return queryData;
};

app.get("/students", async (req, res) => {
  try {
    const students = await fetchAllExamples(
      "filter=or(equals('userType','Staff'),equals('name','Harry Potter'))"
    );
    res.status(200).json({
      data: students,
    });
  } catch (error) {
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
