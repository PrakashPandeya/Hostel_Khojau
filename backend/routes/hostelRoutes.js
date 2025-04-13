const express = require('express');
const router = express.Router();
const Hostel = require('../models/Hostel');

// Get all hostels (with optional featured filter)
router.get('/', async (req, res) => {
  try {
    const { featured } = req.query;
    let query = {};
    
    if (featured) {
      query.isFeatured = featured === 'true';
    }
    
    const hostels = await Hostel.find(query);
    res.json(hostels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single hostel
router.get('/:id', async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }
    res.json(hostel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create hostel (admin only)
router.post('/', async (req, res) => {
  const hostel = new Hostel({
    name: req.body.name,
    location: req.body.location,
    city: req.body.city,
    description: req.body.description,
    hostelType: req.body.hostelType,
    priceRange: req.body.priceRange,
    amenities: req.body.amenities,
    images: req.body.images,
    isFeatured: req.body.isFeatured || false,
    contact: req.body.contact,
    ownername: req.body.ownername
  });

  try {
    const newHostel = await hostel.save();
    res.status(201).json(newHostel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;