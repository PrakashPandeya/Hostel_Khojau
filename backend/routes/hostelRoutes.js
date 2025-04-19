const express = require('express');
const router = express.Router();
const Hostel = require('../models/Hostel');
const Room = require('../models/Room');
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// Get all hostels
router.get('/', async (req, res) => {
  try {
    const hostels = await Hostel.find({ isApproved: true })
      .populate('owner', 'name email')
      .populate('rooms')
      .populate('bookings');
    res.json(hostels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get hostel by ID
router.get('/:id', async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('rooms')
      .populate('bookings');
    if (!hostel || !hostel.isApproved) {
      return res.status(404).json({ message: 'Hostel not found' });
    }
    res.json(hostel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get rooms for a hostel
router.get('/:id/rooms', async (req, res) => {
  try {
    const rooms = await Room.find({ hostel: req.params.id });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new hostel
router.post(
  '/',
  [
    auth,
    authorize('owner'),
    check('name', 'Name is required').not().isEmpty(),
    check('location', 'Location is required').not().isEmpty(),
    check('city', 'City is required').not().isEmpty(),
    check('hostelType', 'Hostel type is required').isIn(['Boys Hostel', 'Girls Hostel', 'Co-ed']),
    check('priceRange.min', 'Minimum price is required').isNumeric(),
    check('priceRange.max', 'Maximum price is required').isNumeric(),
    check('description', 'Description is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const hostel = new Hostel({
        ...req.body,
        owner: req.user.id,
        isApproved: false
      });

      const newHostel = await hostel.save();
      res.status(201).json(newHostel);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// Update hostel
router.put(
  '/:id',
  [auth, authorize('owner', 'admin')],
  async (req, res) => {
    try {
      const hostel = await Hostel.findById(req.params.id);
      if (!hostel) {
        return res.status(404).json({ message: 'Hostel not found' });
      }

      if (req.user.role !== 'admin' && hostel.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      Object.assign(hostel, req.body);
      const updatedHostel = await hostel.save();
      res.json(updatedHostel);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// Delete hostel
router.delete(
  '/:id',
  [auth, authorize('owner', 'admin')],
  async (req, res) => {
    try {
      const hostel = await Hostel.findById(req.params.id);
      if (!hostel) {
        return res.status(404).json({ message: 'Hostel not found' });
      }

      if (req.user.role !== 'admin' && hostel.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      await hostel.deleteOne();
      res.json({ message: 'Hostel deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;