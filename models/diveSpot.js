const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const DiveSpotSchema = new Schema({
  title: String,
  images: [
    {
      url: String,
      filename: String
    }
  ],
  description: String,
  depth: Number,
  location: String,
  latitude: Number,
  longitude: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ]
});

DiveSpotSchema.post("findOneAndDelete", async (doc) => {
  try {
    if (doc) {
      await Review.deleteMany({
        _id: {
          $in: doc.reviews
        }
      });
    }
  } catch (err) {
    console.log(err.message);
    throw err;
  }
});

module.exports = mongoose.model("DiveSpot", DiveSpotSchema);