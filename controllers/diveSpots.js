const DiveSpot = require("../models/diveSpot");

module.exports.index = async (req, res) => {
  const diveSpots = await DiveSpot.find({});
  res.render("diveSpots/index", { diveSpots });
};

module.exports.renderNewForm = (req, res) => {
  res.render("diveSpots/new");
};

module.exports.create = async (req, res, next) => {
  const diveSpot = new DiveSpot(req.body.diveSpot);
  diveSpot.author = req.user._id
  await diveSpot.save();
  req.setNotification("success", "Successfully made a new dive spot!");
  res.redirect(`/diveSpots/${diveSpot._id}`);
};

module.exports.getById = async (req, res) => {
  const { id } = req.params;
  const diveSpot = await DiveSpot
    .findById(id)
    .populate("author")
    .populate({ path: "reviews", populate: { path: "author" } });

  if (!diveSpot) {
    req.setNotification("error", "Cannot find that dive spot =(");
    return res.redirect("/diveSpots");
  }

  res.render("diveSpots/show", { diveSpot });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const diveSpot = await DiveSpot.findById(id);
  res.render("diveSpots/edit", { diveSpot });
};

module.exports.edit = async (req, res) => {
  const { id } = req.params;
  const diveSpot = await DiveSpot.findByIdAndUpdate(id, { ...req.body.diveSpot })
  req.setNotification("success", "Successfully updated the dive spot!");
  res.redirect(`/diveSpots/${diveSpot._id}`);
};

module.exports.delete = async (req, res) => {
  const { id } = req.params;
  const diveSpot = await DiveSpot.findByIdAndDelete(id);
  req.setNotification("success", "Successfully deleted dive spot!");
  res.redirect("/diveSpots");
};