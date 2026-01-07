const ExpressError = require("./ExpressError");

const unknownEndpoint = (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
};

const errorHandler = (error, req, res, next) => {
  const { statusCode = 500 } = error;
  if (!error.message) error.message = "Unexpected error =(";
  res.status(statusCode).render("error", { ...error, stack: error.stack });
};

module.exports = {
  unknownEndpoint,
  errorHandler
}