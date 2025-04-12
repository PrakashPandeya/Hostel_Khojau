const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  hostelType: {
    type: String,
    enum: ['Boys Hostel', 'Girls Hostel', ],
    required: true
  },
  priceRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  amenities: [String],
  images: [String],
  isFeatured: {
    type: Boolean,
    default: false
  },
  contact: {
    phone: String,
    email: String
  },
  rating: {
    type: Number,
    default: 0
  },
  reviews: [{
    userId: mongoose.Schema.Types.ObjectId,
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Hostel', hostelSchema);