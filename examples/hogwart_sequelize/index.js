const express = require("express");
const dotenv = require("dotenv");
const url = require("url");
const cors = require("cors");
const { Students } = require("./model");
const { fetchQuery } = require("./helper");

//configurations
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/students", async (req, res) => {
  try {
    //turn query to a raw string
    const query = url.parse(req.url).query;
    //fetch queries
    const students = await fetchQuery(query, Students);
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
