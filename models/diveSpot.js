const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DiveSpotSchema = new Schema({
  title: String,
  image: String,
  description: String,
  depth: Number,
  location: String,
  latitude: Number,
  longitude: Number,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ]
});

module.exports = mongoose.model("DiveSpot", DiveSpotSchema);