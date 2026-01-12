const mongoose = require("mongoose");
const DiveSpot = require("../models/diveSpot");
const User = require("../models/user");
const divesJson = require("./diveSpots.json");

mongoose.connect("mongodb://localhost:27017/plunge")
  .then(async () => {
    await seedDb();
    console.log("Database seeded.");
    await mongoose.disconnect();
  })
  .catch(error => {
    console.error(error);
  });

const seedDb = async () => {
  await DiveSpot.deleteMany({});
  await User.deleteMany({});

  const bob = {
    username: "bob",
    email: "bob@email.com"
  };

  const user = await User.register(bob, "bob");

  const d = new DiveSpot({
    title: "Alki Beach",
    images: { url: "/img/dive10.jpg", filename: "dive10" },
    depth: 20,
    description: "Small rock reef with good night life.",
    location: "Seattle, WA",
    geometry: {
      type: "Point",
      coordinates: [-122.24, 47.34]
    },
    author: user._id
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
    d.author = user._id;
    return new DiveSpot({ ...d });
  });

  await DiveSpot.insertMany(dives);
}