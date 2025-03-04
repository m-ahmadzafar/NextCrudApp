const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  model: { type: String, required: true },
  company: { type: String, required: true },
  color: String,
  status: String,
  releaseDate: String,
  unitsSold: { type: Number, default: 0 },
});

const Car = mongoose.model("Car", carSchema);
module.exports = Car;