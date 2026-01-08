const reviewRouter = require("express").Router({ mergeParams: true });
const DiveSpot = require("../models/diveSpot");
const Review = require("../models/review");
const { validateReview } = require("../utils/validations");


reviewRouter.post("/", validateReview, async (req, res) => {
  const diveSpot = await DiveSpot.findById(req.params.id);
  const review = new Review(req.body.review);
  diveSpot.reviews.push(review);
  await review.save();
  await diveSpot.save();
  res.redirect(`/diveSpots/${diveSpot._id}`);
});

reviewRouter.delete("/:reviewId", async (req, res) => {
  const { id, reviewId } = req.params;
  await DiveSpot.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/diveSpots/${id}`);
});

module.exports = reviewRouter;