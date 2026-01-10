const diveSpotRouter = require("express").Router();
const { validateDiveSpot } = require("../utils/validations");
const { isLoggedIn, isDiveSpotAuthor } = require("../utils/middleWare");
const diveSpots = require("../controllers/diveSpots");

diveSpotRouter.route("/")
  .get(diveSpots.index)
  .post(isLoggedIn, validateDiveSpot, diveSpots.create);

diveSpotRouter.get("/new", isLoggedIn, diveSpots.renderNewForm);

diveSpotRouter.route("/:id")
  .get(diveSpots.getById)
  .put(isLoggedIn, isDiveSpotAuthor, validateDiveSpot, diveSpots.edit)
  .delete(isLoggedIn, isDiveSpotAuthor, diveSpots.delete);

diveSpotRouter.get("/:id/edit", isLoggedIn, isDiveSpotAuthor, diveSpots.renderEditForm);

module.exports = diveSpotRouter;