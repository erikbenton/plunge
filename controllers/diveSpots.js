const DiveSpot = require("../models/diveSpot");
const { cloudinary } = require("../utils/cloudinary");
const maptilerClient = require("@maptiler/client");

maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req, res) => {
  const { searchTerm } = req.query;

  // prepare diveSpots
  let diveSpots;

  if (searchTerm) {
    // search both the title and/or location contains term
    const search = new RegExp(searchTerm, "i");
    diveSpots = await DiveSpot
      .find({ $or: [{ title: search },{ location: search }] })
      .exec();
  } else {
    diveSpots = await DiveSpot.find();
  }

  res.render("diveSpots/index", { diveSpots });
};

module.exports.renderNewForm = (req, res) => {
  res.render("diveSpots/new");
};

module.exports.create = async (req, res, next) => {
  const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
  const geoData = await maptilerClient.geocoding.forward(req.body.diveSpot.location);
  if (geoData.features.length === 0) {
    req.setNotification("error", "Could not geocode that location. Please try again with a valid location.");
    return res.redirect("/diveSpots/new");
  }
  const diveSpot = new DiveSpot(req.body.diveSpot);
  const geolocation = geoData.features[0];
  diveSpot.geometry = geolocation.geometry;
  diveSpot.author = req.user._id
  diveSpot.images = images;
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
  const images = req.files.map(f => ({ url: f.path, filename: f.filename }));

  const geoData = await maptilerClient.geocoding.forward(req.body.diveSpot.location);
  if (geoData.features.length === 0) {
    req.setNotification("error", "Could not geocode that location. Please try again with a valid location.");
    return res.redirect(`/diveSpots/${id}/edit`);
  }

  const diveSpot = await DiveSpot.findByIdAndUpdate(id, { ...req.body.diveSpot });

  if (req.body.deleteImages) {
    const { deleteImages } = req.body;
    for (let img of deleteImages) {
      await cloudinary.uploader.destroy(img);
    }
    diveSpot.images = diveSpot.images.filter(img => !deleteImages.includes(img.filename));
  }

  diveSpot.images.push(...images);
  const geolocation = geoData.features[0];
  diveSpot.geometry = geolocation.geometry;
  await diveSpot.save();
  req.setNotification("success", "Successfully updated the dive spot!");
  res.redirect(`/diveSpots/${diveSpot._id}`);
};

module.exports.delete = async (req, res) => {
  const { id } = req.params;
  const diveSpot = await DiveSpot.findByIdAndDelete(id);
  req.setNotification("success", "Successfully deleted dive spot!");
  res.redirect("/diveSpots");
};