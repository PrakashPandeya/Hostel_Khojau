const express = require('express');
const router = express.Router();
const Hostel = require('../models/Hostel');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// Get owner's hostels
router.get('/hostels', [auth, authorize('owner')], async (req, res) => {
  try {
    const hostels = await Hostel.find({ owner: req.user.id })
    .populate('rooms bookings')
    .populate('reviews.userId', 'name') 
    .lean();
    res.json(hostels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add room to hostel
router.post(
  '/hostels/:hostelId/rooms',
  [
    auth,
    authorize('owner'),
    check('roomNumber', 'Room number is required').not().isEmpty(),
    check('roomType', 'Room type is required').isIn(['Single', 'Double', 'Triple', 'Dorm']),
    check('monthlyPrice', 'Monthly price is required').isNumeric() //  pricing in monthlyPrice
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const hostel = await Hostel.findById(req.params.hostelId);
      if (!hostel || hostel.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      const room = new Room({
        hostel: req.params.hostelId,
        roomNumber: req.body.roomNumber,
        roomType: req.body.roomType,
        monthlyPrice: req.body.monthlyPrice 
      });

      const newRoom = await room.save();
      await Hostel.findByIdAndUpdate(req.params.hostelId, {
        $push: { rooms: newRoom._id }
      });

      res.status(201).json(newRoom);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// Get bookings for owner's hostels
router.get('/bookings', [auth, authorize('owner')], async (req, res) => {
  try {
    const hostels = await Hostel.find({ owner: req.user.id });
    const hostelIds = hostels.map(h => h._id);
    const bookings = await Booking.find({ hostelId: { $in: hostelIds } })
      .populate('userId', 'name email')
      .populate('hostelId', 'name')
      .populate('roomId', 'roomNumber roomType monthlyPrice');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;