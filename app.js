const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const logger = require("./utils/requestLogger");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const middleWare = require("./utils/middleWare");
const diveSpotRouter = require("./controllers/diveSpots");
const reviewRouter = require("./controllers/reviews");
const userRouter = require("./controllers/users");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

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
app.use(methodOverride("_method"));

// EJS configuration
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session configuration
const sessionConfig = {
  secret: "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};

app.use(session(sessionConfig));

// User Auth
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// For EJS templates
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Notifications
app.use(middleWare.checkNotifications);

// Logging
app.use(logger);

app.get("/", (req, res) => {
  res.render("home");
});

// Controllers/routes
app.use("/", userRouter);
app.use("/diveSpots", diveSpotRouter);
app.use("/diveSpots/:id/reviews", reviewRouter);

// Handle unknown/errors
app.use(middleWare.unknownEndpoint);
app.use(middleWare.errorHandler);

module.exports = app;