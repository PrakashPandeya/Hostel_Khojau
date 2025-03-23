const mongoose = require('mongoose');
const Hostel = require('./models/Hostel');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

// Sample hostel data with new entries
const hostels = [
  {
    name: 'Hostel A',
    institute: 'Institute 1',
    city: 'Kathmandu',
    gender: 'Male',
    priceRange: '5000-10000',
    image: 'https://example.com/hostel-a.jpg',
    description: 'A comfortable hostel for students.',
  },
  {
    name: 'Hostel B',
    institute: 'Institute 2',
    city: 'Pokhara',
    gender: 'Female',
    priceRange: '10000-15000',
    image: 'https://example.com/hostel-b.jpg',
    description: 'A peaceful hostel near the lake.',
  },
  {
    name: 'Hostel C',
    institute: 'Institute 1',
    city: 'Kathmandu',
    gender: 'Male',
    priceRange: '5000-10000',
    image: 'https://example.com/hostel-a.jpg',
    description: 'A comfortable hostel for students.',
  },
  {
    name: 'Hostel D',
    institute: 'Institute 2',
    city: 'Pokhara',
    gender: 'Female',
    priceRange: '5000-10000',
    image: 'https://example.com/hostel-b.jpg',
    description: 'A peaceful hostel near the lake.',
  },
  // Add new hostels here
  {
    name: 'Hostel E',
    institute: 'Institute 3',
    city: 'Lalitpur',
    gender: 'Mixed',
    priceRange: '7000-12000',
    image: 'https://example.com/hostel-e.jpg',
    description: 'A modern hostel with great facilities.',
  },
  {
    name: 'Hostel F',
    institute: 'Institute 4',
    city: 'Bhaktapur',
    gender: 'Female',
    priceRange: '8000-13000',
    image: 'https://example.com/hostel-f.jpg',
    description: 'A cozy hostel in a historic city.',
  },
];

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');

    // Check for existing hostels to avoid duplicates
    return Hostel.find({});
  })
  .then((existingHostels) => {
    // Filter out hostels that already exist in the database
    const existingHostelNames = existingHostels.map((hostel) => hostel.name);
    const newHostels = hostels.filter((hostel) => !existingHostelNames.includes(hostel.name));

    if (newHostels.length > 0) {
      // Insert only new hostels
      return Hostel.insertMany(newHostels);
    } else {
      console.log('No new hostels to add.');
      return Promise.resolve();
    }
  })
  .then(() => {
    console.log('Hostels seeded successfully');
    process.exit(0); // Exit the script
  })
  .catch((err) => {
    console.error('Error seeding hostels:', err);
    process.exit(1); // Exit with an error
  });