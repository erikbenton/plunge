const DiveSpot = require("../models/diveSpot");
const Review = require("../models/review");

module.exports.create = async (req, res) => {
  const diveSpot = await DiveSpot.findById(req.params.id);
  const review = new Review(req.body.review);
  diveSpot.reviews.push(review);
  review.author = req.user._id;
  await review.save();
  await diveSpot.save();
  req.setNotification("success", "Created new review!");
  res.redirect(`/diveSpots/${diveSpot._id}`);
};

module.exports.delete = async (req, res) => {
  const { id, reviewId } = req.params;
  await DiveSpot.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
  await Review.findByIdAndDelete(reviewId);
  req.setNotification("success", "Successfully deleted review!");
  res.redirect(`/diveSpots/${id}`);
};