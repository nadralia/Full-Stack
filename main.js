const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
require("dotenv").config();
const cors = require("cors");

// routes
const usersRoutes = require("./server/routes/user.route");
const productRoutes = require("./server/routes/product.route");
const categoryRoutes = require("./server/routes/category.route");
const cartRoutes = require("./server/routes/cart.route");
const wishlistRoutes = require("./server/routes/wishlist.route");
const addressRoutes = require("./server/routes/address.route");
const orderRoutes = require("./server/routes/order.route");
const permissionsRoutes = require("./server/routes/permission.route");

const app = express();

app.use(express.json());

//cors middleware
app.use(cors());

// morgan logger for dev
app.use(logger("dev"));

//make our upload an accesable folder
app.use("/uploads", express.static("uploads"));

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
app.use("/api/product", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/permissions", permissionsRoutes);


if (process.env.NODE_ENV !== "production") require("dotenv").config();

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "client", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}


app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.response
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is connected on port ${PORT}`);
});