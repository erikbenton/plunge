const ExpressError = require("./ExpressError");
const { getNotifications, setNotification } = require("./notifications");

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
  unknownEndpoint,
  errorHandler
}