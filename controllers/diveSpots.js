const diveSpotRouter = require("express").Router();
const DiveSpot = require("../models/diveSpot");
const { validateDiveSpot } = require("../utils/validations");
const { isLoggedIn } = require("../utils/middleWare");

diveSpotRouter.get("/", async (req, res) => {
  const diveSpots = await DiveSpot.find({});
  res.render("diveSpots/index", { diveSpots });
});

diveSpotRouter.get("/new", isLoggedIn, (req, res) => {
  res.render("diveSpots/new");
});

diveSpotRouter.post("/", isLoggedIn, validateDiveSpot, async (req, res, next) => {
  const diveSpot = new DiveSpot(req.body.diveSpot);
  await diveSpot.save();
  req.setNotification("success", "Successfully made a new dive spot!");
  res.redirect(`/diveSpots/${diveSpot._id}`);
});

diveSpotRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const diveSpot = await DiveSpot
    .findById(id)
    .populate("reviews");

  if (!diveSpot) {
    req.setNotification("error", "Cannot find that dive spot =(");
    return res.redirect("/diveSpots");
  }

  res.render("diveSpots/show", { diveSpot });
});

diveSpotRouter.get("/:id/edit", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const diveSpot = await DiveSpot.findById(id);
  res.render("diveSpots/edit", { diveSpot });
});

diveSpotRouter.put("/:id", isLoggedIn, validateDiveSpot, async (req, res) => {
  const { id } = req.params;
  const diveSpot = await DiveSpot.findByIdAndUpdate(id, { ...req.body.diveSpot });
  req.setNotification("success", "Successfully updated the dive spot!");
  res.redirect(`/diveSpots/${diveSpot._id}`);
});

diveSpotRouter.delete("/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const diveSpot = await DiveSpot.findByIdAndDelete(id);
  req.setNotification("success", "Successfully deleted dive spot!");
  res.redirect("/diveSpots");
});

module.exports = diveSpotRouter;