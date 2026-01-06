const mongoose = require("mongoose");
const DiveSpot = require("../models/diveSpot");
const divesJson = require("./diveSpots.json");

mongoose.connect("mongodb://localhost:27017/plunge")
  .then(async () => {
    await seedDb();
    console.log("Database seeded.");
  })
  .catch(error => {
    console.error(error);
  });

const seedDb = async () => {
  await DiveSpot.deleteMany({});

  const d = new DiveSpot({
    title: "Alki Beach",
    image: "/img/dive10.jpg",
    depth: 20,
    description: "Small rock reef with good night life.",
    location: "Seattle, WA",
    latitude: 47.34,
    longitude: 122.24
  });
  await d.save();

  const dives = divesJson.map(d => new DiveSpot({ ...d }));
  for (let i = 0; i < dives.length; i++) {
    await dives[i].save();
  }
}