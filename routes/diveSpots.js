const diveSpotRouter = require("express").Router();
const { validateDiveSpot } = require("../utils/validations");
const { isLoggedIn, isDiveSpotAuthor } = require("../utils/middleWare");
const diveSpots = require("../controllers/diveSpots");
const multer = require("multer");
const { storage } = require("../utils/cloudinary");
const upload = multer({ storage, limits: { files: 5 } });

diveSpotRouter.route("/")
  .get(diveSpots.index)
  .post(isLoggedIn, upload.array("diveSpot[images]"), validateDiveSpot, diveSpots.create);

diveSpotRouter.get("/new", isLoggedIn, diveSpots.renderNewForm);

diveSpotRouter.route("/:id")
  .get(diveSpots.getById)
  .put(isLoggedIn, isDiveSpotAuthor, upload.array("diveSpot[images]"), validateDiveSpot, diveSpots.edit)
  .delete(isLoggedIn, isDiveSpotAuthor, diveSpots.delete);

diveSpotRouter.get("/:id/edit", isLoggedIn, isDiveSpotAuthor, diveSpots.renderEditForm);

module.exports = diveSpotRouter;