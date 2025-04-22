const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Hostel = require('../models/Hostel');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const axios = require('axios');

// Check room availability
router.post(
  '/check-availability',
  [
    check('roomId', 'Room ID is required').not().isEmpty(),
    check('checkInDate', 'Check-in date is required').isISO8601(),
    check('checkOutDate', 'Check-out date is required').isISO8601(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { roomId, checkInDate, checkOutDate } = req.body;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkOut <= checkIn) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    try {
      // Check if the room exists and is available
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
      if (!room.isAvailable) {
        return res.json({ isAvailable: false });
      }

      // Check for overlapping bookings
      const overlappingBookings = await Booking.find({
        roomId: roomId,
        status: { $in: ['pending', 'confirmed'] }, // Only consider active bookings
        $or: [
          { checkInDate: { $lte: checkOut, $gte: checkIn } },
          { checkOutDate: { $lte: checkOut, $gte: checkIn } },
          { checkInDate: { $lte: checkIn }, checkOutDate: { $gte: checkOut } },
        ],
      });

      if (overlappingBookings.length > 0) {
        return res.json({ isAvailable: false });
      }

      // Calculate total price (price per month)
      const months = (checkOut - checkIn) / (1000 * 60 * 60 * 24 * 30); // Approximate months
      const totalPrice = room.price * months;

      res.json({ isAvailable: true, totalPrice });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Create a booking
router.post(
  '/:hostelId/book',
  [
    auth,
    check('roomId', 'Room ID is required').not().isEmpty(),
    check('checkInDate', 'Check-in date is required').isISO8601(),
    check('checkOutDate', 'Check-out date is required').isISO8601(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { roomId, checkInDate, checkOutDate } = req.body;
      const hostel = await Hostel.findById(req.params.hostelId);
      if (!hostel || !hostel.isApproved) {
        return res.status(404).json({ message: 'Hostel not found or not approved' });
      }

      const room = await Room.findById(roomId);
      if (!room || !room.isAvailable) {
        return res.status(400).json({ message: 'Room not available' });
      }

      // Calculate total amount (simplified: price per month)
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const months = (checkOut - checkIn) / (1000 * 60 * 60 * 24 * 30); // Approximate months
      const totalAmount = room.price * months;

      const booking = new Booking({
        userId: req.user.id,
        hostelId: req.params.hostelId,
        roomId: roomId,
        checkInDate,
        checkOutDate,
        totalPrice: totalAmount,
      });

      // Initiate Khalti payment
      const khaltiResponse = await axios.post(
        'https://khalti.com/api/v2/payment/initiate/',
        {
          return_url: 'http://localhost:5173/payment/callback',
          website_url: 'http://localhost:5173',
          amount: totalAmount * 100, // Khalti expects amount in paisa
          purchase_order_id: booking._id.toString(),
          purchase_order_name: `Booking for ${hostel.name}`,
          customer_info: {
            name: req.user.name, // Assumes req.user.name is available via auth middleware
            email: req.user.email, // Assumes req.user.email is available
            phone: '9800000000', // Add phone to User model if needed
          },
        },
        {
          headers: {
            Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          },
        }
      );

      booking.paymentId = khaltiResponse.data.payment_id;
      await booking.save();

      // Mark room as unavailable
      room.isAvailable = false;
      await room.save();

      await Hostel.findByIdAndUpdate(req.params.hostelId, {
        $push: { bookings: booking._id },
      });

      res.json({ paymentUrl: khaltiResponse.data.payment_url, booking });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// Verify payment callback
router.post('/payment/verify', auth, async (req, res) => {
  try {
    const { payment_id, status } = req.body;
    const booking = await Booking.findOne({ paymentId: payment_id });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (status === 'Completed') {
      booking.paymentStatus = 'completed';
      booking.status = 'confirmed';
    } else {
      booking.paymentStatus = 'failed';
      booking.status = 'cancelled';
      // Mark room as available again
      await Room.findByIdAndUpdate(booking.roomId, { isAvailable: true });
    }

    await booking.save();
    res.json({ message: 'Payment verified', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('hostelId')
      .populate('roomId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;