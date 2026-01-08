const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const logger = require("./utils/requestLogger");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ejsHelpers = require("./utils/ejsHelpers");
const middleWare = require("./utils/middleWare");
const diveSpotRouter = require("./controllers/diveSpots");
const reviewRouter = require("./controllers/reviews");

mongoose.connect("mongodb://localhost:27017/plunge")
  .then(() => {
    console.log("Database connected.");
  })
  .catch(error => {
    console.error(error);
  });

const app = express();

// Static files for hosting
app.use(express.static(path.join(__dirname, "public")));

// parsing API JSON data
app.use(express.json());
// parsing form request body json
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(methodOverride("_method"));

// EJS configuration
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.locals.ejs = ejsHelpers; // adding some helpers to use in EJS files

app.get("/", (req, res) => {
  res.render("home");
});

// Controllers/routes
app.use("/diveSpots", diveSpotRouter);
app.use("/diveSpots/:id/reviews", reviewRouter);

app.use(middleWare.unknownEndpoint);
app.use(middleWare.errorHandler);

module.exports = app;