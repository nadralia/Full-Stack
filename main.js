const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
require("dotenv").config();
const cors = require("cors");

// routes
const usersRoutes = require("./server/routes/user.route");

const app = express();

app.use(express.json());

//cors middleware
app.use(cors());

const DBURI = process.env.DB_URI;

mongoose.connect(DBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});


//database connection
let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database connected succefully...");
});

// main routes
app.use("/api/users", usersRoutes);


// App's connection port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is connected on port ${PORT}`);
});