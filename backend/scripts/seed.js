require('dotenv').config();
const mongoose = require('mongoose');
const Hostel = require('../models/Hostel');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const hostels = [
  {
    name: "Kamalpokhari Boys Hostel",
    location: "Kamalpokhari, Kathmandu",
    city: "Kathmandu",
    description: "Premium boys hostel with all modern amenities",
    hostelType: "Boys Hostel",
    priceRange: { min: 10000, max: 15000 },
    amenities: ["WiFi", "Laundry", "24/7 Security"],
    images: ["D:/Git repos/Hostel_Khojau/frontend/public/images/KBH.jpg"],
    isFeatured: true,
    contact: {
      phone: "9800000001",
      email: "kbh@gmail.com"
    }
  },
  {
    name: "Fatima Girls Hostel",
    location: "Kamalpokhari, Kathmandu",
    city: "Kathmandu",
    description: "Premium girls hostel with all modern amenities",
    hostelType: "Girls Hostel",
    priceRange: { min: 8000, max: 12000 },
    amenities: ["WiFi", "Laundry", "Cafeteria", "24/7 Security"],
    images: ["https://example.com/hostel1.jpg"],
    isFeatured: true,
    contact: {
      phone: "9841000001",
      email: "lalington@example.com"
    }
  }
];

Hostel.insertMany(hostels)
  .then(() => {
    console.log('🌱 Data seeded successfully');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('❌ Error seeding data:', err);
    mongoose.connection.close();
  });
