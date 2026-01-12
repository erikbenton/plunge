const mongoose = require("mongoose");
const Review = require("./review");
const ImageSchema = require("./images");
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };

const DiveSpotSchema = new Schema({
  title: String,
  images: [ ImageSchema ],
  description: String,
  depth: Number,
  location: String,
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
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
}, opts);

DiveSpotSchema.virtual("properties.popUpMarkup").get(function() {
  return `
  <strong><a href="/diveSpots/${this._id}">${this.title}</a></strong>
  <p>${this.description.substring(0, 20)}...</p>`
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