const express = require('express');
const router = express.Router();
const Hostel = require('../models/Hostel');
const Room = require('../models/Room');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// Get all hostels
router.get('/', async (req, res) => {
  try {
    const query = req.query.featured === 'true' ? { isFeatured: true } : {};
    const hostels = await Hostel.find(query)
      .select('-images -images360')
      .populate('owner', 'name email')
      .populate('rooms')
      .populate('bookings')
      .lean();
    res.json(hostels);
  } catch (err) {
    console.error('Error fetching hostels:', err.message);
    res.status(500).json({ message: 'Failed to fetch hostels: ' + err.message });
  }
});

// Get hostel by ID
router.get('/:id', async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('rooms')
      .populate('bookings')
      .populate('reviews.userId', 'name')
      .lean();
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }
    res.json(hostel);
  } catch (err) {
    console.error('Error fetching hostel by ID:', err.message);
    res.status(500).json({ message: 'Failed to fetch hostel: ' + err.message });
  }
});

// Get rooms for a hostel
router.get('/:id/rooms', async (req, res) => {
  try {
    const rooms = await Room.find({ hostel: req.params.id }).lean();
    res.json(rooms);
  } catch (err) {
    console.error('Error fetching rooms:', err.message);
    res.status(500).json({ message: 'Failed to fetch rooms: ' + err.message });
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
    check('description', 'Description is required').not().isEmpty(),
    check('images', 'Images must be an array').isArray().optional(),
    check('images', 'Maximum 3 images allowed').custom((value) => !value || value.length <= 3),
    check('images.*', 'Each image must be a string').isString().optional(),
    check('images360', '360-degree images must be an array').isArray().optional(),
    check('images360.*', 'Each 360-degree image must be a string').isString().optional(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id);
      const hostelData = {
        ...req.body,
        owner: req.user.id,
        status: user.isApproved ? 'active' : 'pending',
        images: req.body.images || [],
        images360: req.body.images360 || [],
      };

      const hostel = new Hostel(hostelData);
      const newHostel = await hostel.save();

      await User.findByIdAndUpdate(req.user.id, {
        $push: { ownedHostels: newHostel._id }
      });

      res.status(201).json(newHostel);
    } catch (err) {
      console.error('Error creating hostel:', err.message);
      res.status(400).json({ message: 'Failed to create hostel: ' + err.message });
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
      console.error('Error updating hostel:', err.message);
      res.status(400).json({ message: 'Failed to update hostel: ' + err.message });
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
      console.error('Error deleting hostel:', err.message);
      res.status(500).json({ message: 'Failed to delete hostel: ' + err.message });
    }
  }
);


module.exports = router;