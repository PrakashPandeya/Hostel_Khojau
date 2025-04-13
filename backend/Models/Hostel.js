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
    enum: ['Boys Hostel', 'Girls Hostel', 'Co-ed'],
    required: true
  },
  priceRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  amenities: [String],
  images: [String],
  images360: [{
    type: String, 
    validate: {
      validator: function(v) {
        return /^https?:\/\//.test(v); // Simple URL validation
      },
      message: props => `${props.value} is not a valid URL!`
    }
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  ownername: {
    type: String,
    required: true
  },
  mapEmbedUrl: {
    type: String,
    required: true
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