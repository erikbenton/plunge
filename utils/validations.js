const ExpressError = require("./ExpressError");
const { diveSpotSchema, reviewSchema } = require("./schemas");

const validateSchema = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body);
    } catch (err) {
      const messages = err.details.map(d => d.message).join("/r/n");
      throw new ExpressError(messages, 400);
    }

    next();
  };
}

const validateDiveSpot = validateSchema(diveSpotSchema);
const validateReview = validateSchema(reviewSchema);

module.exports = {
  validateDiveSpot,
  validateReview
}