const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  city: { type: String, required: true },
  description: { type: String, required: true },
  hostelType: { type: String, enum: ['Boys Hostel', 'Girls Hostel', 'Co-ed'], required: true },
  priceRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  images: [{ type: String }],
  images360: [{ type: String }], // Corrected from "images360:"
  amenities: [{ type: String }],
  mapEmbedUrl: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownername: { type: String }, // Optional, for backward compatibility
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
  isApproved: { type: Boolean, default: false },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
  contact: {
    phone: String,
    email: String,
  },
  reviews: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, min: 1, max: 5, required: true },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  isFeatured: { type: Boolean, default: false }, // Added for isFeatured
});

module.exports = mongoose.model('Hostel', hostelSchema);