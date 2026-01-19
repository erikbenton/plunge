if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const logger = require("./utils/requestLogger");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const middleWare = require("./utils/middleWare");
const diveSpotRouter = require("./routes/diveSpots");
const reviewRouter = require("./routes/reviews");
const userRouter = require("./routes/users");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const sanitizeV5 = require("./utils/mongoSanitizeV5");
const sessionConfig = require("./utils/sessionConfig");
const helmet = require("helmet");
const cspConfig = require('./utils/contentSecurityPolicyConfig');
const { MongoStore } = require('connect-mongo');
const prodDb = process.env.MONGODB_URI;
const localDb = "mongodb://localhost:27017/plunge";
const mongoUrl = process.env.NODE_ENV === "production"
  ? prodDb
  : localDb;

mongoose.connect(mongoUrl)
  .then(() => {
    console.log("Database connected.");
  })
  .catch(error => {
    console.error(error);
  });

const app = express();

app.set("query parser", "extended");

// Static files for hosting
app.use(express.static(path.join(__dirname, "public")));

// Sanitize requests
app.use(sanitizeV5({ replaceWith: "_" }));

// parsing API JSON data
app.use(express.json());
// parsing form request body json
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// EJS configuration
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const store = MongoStore.create({
  mongoUrl: mongoUrl,
  touchAfter: 24 * 60 * 60, // 1 day
  crypto: {
    secret: process.env.MONGO_STORE_SECRET
  }
});

store.on("error", function(err) {
  console.log("session store error", err);
});

// Session configuration
app.use(session(sessionConfig(store)));

// CSP and in-depth security
app.use(helmet());
app.use(helmet.contentSecurityPolicy(cspConfig));

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

// Routes
app.use("/", userRouter);
app.use("/diveSpots", diveSpotRouter);
app.use("/diveSpots/:id/reviews", reviewRouter);

// Handle unknown/errors
app.use(middleWare.unknownEndpoint);
app.use(middleWare.errorHandler);

module.exports = app;