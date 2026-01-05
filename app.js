const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const logger = require("./utils/requestLogger");
const methodOverride = require("method-override");
const DiveSpot = require("./models/diveSpot");

mongoose.connect("mongodb://localhost:27017/plunge")
  .then(() => {
    console.log("Database connected.");
  })
  .catch(error => {
    console.error(error);
  });

const app = express();

// parsing API JSON data
app.use(express.json());
// parsing form request body json
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(methodOverride("_method"));

// EJS configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.get("/", (req, res) => {
  res.render("home");
});

app.get("/diveSpots", async (req, res) => {
  const diveSpots = await DiveSpot.find({});
  res.render("diveSpots/index", { diveSpots });
});

app.get("/diveSpots/new", (req, res) => {
  res.render("diveSpots/new");
});

app.post("/diveSpots", async (req, res) => {
  const diveSpot = new DiveSpot(req.body.diveSpot);
  await diveSpot.save();
  res.redirect(`/diveSpots/${diveSpot._id}`);
});

app.get("/diveSpots/:id", async (req, res) => {
  const { id } = req.params;
  const diveSpot = await DiveSpot.findById(id);
  res.render("diveSpots/show", { diveSpot });
});

app.get("/diveSpots/:id/edit", async (req, res) => {
  const { id } = req.params;
  const diveSpot = await DiveSpot.findById(id);
  res.render("diveSpots/edit", { diveSpot });
});

app.put("/diveSpots/:id", async (req, res) => {
  const { id } = req.params;
  const diveSpot = await DiveSpot.findByIdAndUpdate(id, { ...req.body.diveSpot });
  res.redirect(`/diveSpots/${diveSpot._id}`);
});

app.delete("/diveSpots/:id", async (req, res) => {
  const { id } = req.params;
  const diveSpot = await DiveSpot.findByIdAndDelete(id);
  res.redirect("/diveSpots");
});

module.exports = app;