const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DiveSpotSchema = new Schema({
  title: String,
  description: String,
  depth: Number,
  location: String
});

module.exports = mongoose.model("DiveSpot", DiveSpotSchema);