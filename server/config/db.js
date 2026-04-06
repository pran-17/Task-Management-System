const mongoose = require("mongoose");

async function connectDB() {
  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/mern_portals";
  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri);
  // eslint-disable-next-line no-console
  console.log("MongoDB connected");
}

module.exports = connectDB;

