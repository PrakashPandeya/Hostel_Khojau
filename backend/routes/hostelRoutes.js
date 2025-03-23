// backend/routes/hostelRoutes.js
const express = require('express');
const Hostel = require('../models/Hostel');
const router = express.Router();

// Fetch hostels with filters
router.get('/', async (req, res) => {
  try {
    const filters = req.query;
    const hostels = await Hostel.find(filters);
    res.json(hostels);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hostels', error });
  }
});

// Add a new hostel (optional)
router.post('/', async (req, res) => {
  try {
    const newHostel = new Hostel(req.body);
    await newHostel.save();
    res.status(201).json(newHostel);
  } catch (error) {
    res.status(400).json({ message: 'Error creating hostel', error });
  }
});

// Export the router
module.exports = router;