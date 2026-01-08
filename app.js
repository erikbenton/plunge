const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const logger = require("./utils/requestLogger");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ejsHelpers = require("./utils/ejsHelpers");
const DiveSpot = require("./models/diveSpot");
const Review = require("./models/review");
const middleWare = require("./utils/middleWare");
const { validateDiveSpot, validateReview } = require("./utils/validations");

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
app.locals.ejs = ejsHelpers;


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

app.post("/diveSpots", validateDiveSpot, async (req, res, next) => {
  const diveSpot = new DiveSpot(req.body.diveSpot);
  await diveSpot.save();
  res.redirect(`/diveSpots/${diveSpot._id}`);
});

app.get("/diveSpots/:id", async (req, res) => {
  const { id } = req.params;
  const diveSpot = await DiveSpot
    .findById(id)
    .populate("reviews");

  res.render("diveSpots/show", { diveSpot });
});

app.get("/diveSpots/:id/edit", async (req, res) => {
  const { id } = req.params;
  const diveSpot = await DiveSpot.findById(id);
  res.render("diveSpots/edit", { diveSpot });
});

app.put("/diveSpots/:id", validateDiveSpot, async (req, res) => {
  const { id } = req.params;
  const diveSpot = await DiveSpot.findByIdAndUpdate(id, { ...req.body.diveSpot });
  res.redirect(`/diveSpots/${diveSpot._id}`);
});

app.delete("/diveSpots/:id", async (req, res) => {
  const { id } = req.params;
  const diveSpot = await DiveSpot.findByIdAndDelete(id);
  res.redirect("/diveSpots");
});

app.post("/diveSpots/:id/reviews", validateReview, async (req, res) => {
  const diveSpot = await DiveSpot.findById(req.params.id);
  const review = new Review(req.body.review);
  diveSpot.reviews.push(review);
  await review.save();
  await diveSpot.save();
  res.redirect(`/diveSpots/${diveSpot._id}`);
});

app.delete("/diveSpots/:id/reviews/:reviewId", async (req, res) => {
  const { id, reviewId } = req.params;
  await DiveSpot.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/diveSpots/${id}`);
});

app.use(middleWare.unknownEndpoint);
app.use(middleWare.errorHandler);

module.exports = app;