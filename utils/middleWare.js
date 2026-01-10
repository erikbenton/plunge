const ExpressError = require("./ExpressError");
const { getNotifications, setNotification } = require("./notifications");
const DiveSpot = require("../models/diveSpot");
const Review = require("../models/review");

const checkNotifications = (req, res, next) => {
  req.setNotification = subscribeNotifications(req);
  const notifications = getNotifications(req.sessionID);
  res.locals.notifications = notifications;
  next();
};

const subscribeNotifications = (req) => {
  return (property, value) => {
    setNotification(req.sessionID, property, value);
  };
};

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    setNotification(req.sessionID, "error", "You must be signed in");
    return res.redirect("/login");
  }

  next();
};

const storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }

  next();
};

const isDiveSpotAuthor = async (req, res, next) => {
  const { id } = req.params;
  const diveSpot = await DiveSpot.findById(id);
  if (!diveSpot.author.equals(req.user._id)) {
    req.setNotification("error", "You do not have permission to do that!");
    return res.redirect(`/diveSpots/${id}`);
  }

  next();
}

const isReviewAuthor = async (req, res, next) => {
  const { id: diveSpotId, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.setNotification("error", "You do not have permission to do that!");
    return res.redirect(`/diveSpots/${diveSpotId}`);
  }

  next();
};

const unknownEndpoint = (req, res, next) => {
  next(new ExpressError("Page Not Found: " + req.path, 404));
};

const errorHandler = (error, req, res, next) => {
  const { statusCode = 500 } = error;
  if (!error.message) error.message = "Unexpected error =(";
  console.log(error);
  const expressError = new ExpressError(error.message, statusCode);
  res.status(statusCode).render("error", { ...expressError, stack: error.stack });
};

module.exports = {
  checkNotifications,
  storeReturnTo,
  isLoggedIn,
  isDiveSpotAuthor,
  isReviewAuthor,
  unknownEndpoint,
  errorHandler
}