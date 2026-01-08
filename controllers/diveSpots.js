const diveSpotRouter = require("express").Router();
const DiveSpot = require("../models/diveSpot");
const { setNotification } = require("../utils/notifications");
const { validateDiveSpot } = require("../utils/validations");

diveSpotRouter.get("/", async (req, res) => {
  const diveSpots = await DiveSpot.find({});
  res.render("diveSpots/index", { diveSpots });
});

diveSpotRouter.get("/new", (req, res) => {
  res.render("diveSpots/new");
});

diveSpotRouter.post("/", validateDiveSpot, async (req, res, next) => {
  const diveSpot = new DiveSpot(req.body.diveSpot);
  await diveSpot.save();
  setNotification("root", "success", "Successfully made a new dive spot!");
  res.redirect(`/diveSpots/${diveSpot._id}`);
});

diveSpotRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const diveSpot = await DiveSpot
    .findById(id)
    .populate("reviews");

  if (!diveSpot) {
    setNotification("root", "error", "Cannot find that dive spot =(");
    return res.redirect("/diveSpots");
  }

  res.render("diveSpots/show", { diveSpot });
});

diveSpotRouter.get("/:id/edit", async (req, res) => {
  const { id } = req.params;
  const diveSpot = await DiveSpot.findById(id);
  res.render("diveSpots/edit", { diveSpot });
});

diveSpotRouter.put("/:id", validateDiveSpot, async (req, res) => {
  const { id } = req.params;
  const diveSpot = await DiveSpot.findByIdAndUpdate(id, { ...req.body.diveSpot });
  setNotification("root", "success", "Successfully updated the dive spot!");
  res.redirect(`/diveSpots/${diveSpot._id}`);
});

diveSpotRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const diveSpot = await DiveSpot.findByIdAndDelete(id);
  setNotification("root", "success", "Successfully deleted dive spot!");
  res.redirect("/diveSpots");
});

module.exports = diveSpotRouter;