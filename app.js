const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const DiveSpot = require("./models/diveSpot");

mongoose.connect("mongodb://localhost:27017/plunge")
  .then(() => {
    console.log("Database connected.");
  })
  .catch(error => {
    console.error(error);
  });

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/diveSpots", async (req, res) => {
  const dives = await DiveSpot.find({});
  res.send(dives);
});

app.listen(3003, () => {
  console.log("Serving on port 3003");
});