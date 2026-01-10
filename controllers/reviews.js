const reviewRouter = require("express").Router({ mergeParams: true });
const DiveSpot = require("../models/diveSpot");
const Review = require("../models/review");
const { validateReview } = require("../utils/validations");
const { isLoggedIn, isReviewAuthor } = require("../utils/middleWare");


reviewRouter.post("/", isLoggedIn, validateReview, async (req, res) => {
  const diveSpot = await DiveSpot.findById(req.params.id);
  const review = new Review(req.body.review);
  diveSpot.reviews.push(review);
  review.author = req.user._id;
  await review.save();
  await diveSpot.save();
  req.setNotification("success", "Created new review!");
  res.redirect(`/diveSpots/${diveSpot._id}`);
});

reviewRouter.delete("/:reviewId", isLoggedIn, isReviewAuthor, async (req, res) => {
  const { id, reviewId } = req.params;
  await DiveSpot.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
  await Review.findByIdAndDelete(reviewId);
  req.setNotification("success", "Successfully deleted review!");
  res.redirect(`/diveSpots/${id}`);
});

module.exports = reviewRouter;