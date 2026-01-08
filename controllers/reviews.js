const reviewRouter = require("express").Router({ mergeParams: true });
const DiveSpot = require("../models/diveSpot");
const Review = require("../models/review");
const { setNotification } = require("../utils/notifications");
const { validateReview } = require("../utils/validations");


reviewRouter.post("/", validateReview, async (req, res) => {
  const diveSpot = await DiveSpot.findById(req.params.id);
  const review = new Review(req.body.review);
  diveSpot.reviews.push(review);
  await review.save();
  await diveSpot.save();
  setNotification("root", "success", "Created new review!");
  res.redirect(`/diveSpots/${diveSpot._id}`);
});

reviewRouter.delete("/:reviewId", async (req, res) => {
  const { id, reviewId } = req.params;
  await DiveSpot.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
  await Review.findByIdAndDelete(reviewId);
  setNotification("root", "success", "Successfully deleted review!");
  res.redirect(`/diveSpots/${id}`);
});

module.exports = reviewRouter;