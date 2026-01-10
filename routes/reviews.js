const reviewRouter = require("express").Router({ mergeParams: true });
const { validateReview } = require("../utils/validations");
const { isLoggedIn, isReviewAuthor } = require("../utils/middleWare");
const reviews = require("../controllers/reviews");

reviewRouter.post("/", isLoggedIn, validateReview, reviews.create);

reviewRouter.delete("/:reviewId", isLoggedIn, isReviewAuthor, reviews.delete);

module.exports = reviewRouter;