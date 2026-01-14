require("dotenv").config();
const mongoose = require("mongoose");
const DiveSpot = require("../models/diveSpot");
const Review = require("../models/review");
const User = require("../models/user");
const divesJson = require("./diveSpots.json");
const hawaiiJson = require("./hawaiiSites.json");
const mongoUrl = process.env.MONGODB_URI
//const localDb = "mongodb://localhost:27017/plunge";

mongoose.connect(mongoUrl)
  .then(async () => {
    await seedDb();
    console.log("Database seeded.");
    await mongoose.disconnect();
  })
  .catch(error => {
    console.error(error);
  });

const seedDb = async () => {

  // Clean out the database
  await DiveSpot.deleteMany({});
  await User.deleteMany({});
  await Review.deleteMany({});

  const bob = {
    username: "bob",
    email: "bob@email.com"
  };

  const amy = {
    username: "amy",
    email: "amy@email.com"
  };

  const userBob = await User.register(bob, "bob");
  const userAmy = await User.register(amy, "amy");

  const d = new DiveSpot({
    title: "Alki Beach",
    images: {
      "url": "https://res.cloudinary.com/the-lawlz/image/upload/v1768237016/Plunge/dive10.jpg",
      "filename": "dive10"
    },
    depth: 20,
    description: "Small rock reef with good night life.",
    location: "Seattle, WA",
    geometry: {
      type: "Point",
      coordinates: [-122.24, 47.34]
    },
    author: userBob._id
  });

  await d.save();

  const dives = divesJson.map(d => {
    d.geometry = {
      type: "Point",
      coordinates: [
        d.longitude,
        d.latitude,
      ]
    };
    d.author = userBob._id;
    return new DiveSpot({ ...d });
  });

  const diveTitles = dives.map(d => d.title);

  const hawaiiDives = hawaiiJson.map(d => {
    d.geometry = {
      type: "Point",
      coordinates: [
        d.longitude,
        d.latitude,
      ]
    };
    d.author = userAmy._id;
    return new DiveSpot({ ...d });
  })
    .filter(d => !diveTitles.includes(d.title));

  dives.push(...hawaiiDives);

  await DiveSpot.insertMany(dives);
}