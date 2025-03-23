
const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  institute: { type: String, required: true },
  city: { type: String, required: true },
  gender: { type: String, required: true },
  priceRange: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model('Hostel', hostelSchema);