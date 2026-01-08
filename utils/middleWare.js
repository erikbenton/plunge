const ExpressError = require("./ExpressError");

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
  unknownEndpoint,
  errorHandler
}