const ExpressError = require("./ExpressError");
const { diveSpotSchema } = require("./schemas");

const validateDiveSpot = async (req, res, next) => {
  try {
    await diveSpotSchema.validateAsync(req.body);
  } catch (err) {
    const messages = err.details.map(d => d.message).join("/r/n");
    throw new ExpressError(messages, 400);
  }

  next();
};

module.exports = {
  validateDiveSpot
}