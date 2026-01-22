const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Hostel = require('../models/Hostel');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const { initializeKhaltiPayment, verifyKhaltiPayment } = require('../utils/khalti');

// Create a booking
router.post(
  '/:hostelId/book',
  [
    auth,
    check('roomId', 'Room ID is required').not().isEmpty(),
    check('checkInDate', 'Check-in date is required').isISO8601(),
    check('totalMonthsStaying', 'Total months staying is required').isInt({ min: 1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { roomId, checkInDate, totalMonthsStaying } = req.body;      const hostel = await Hostel.findById(req.params.hostelId);
      if (!hostel) {
        return res.status(404).json({ message: 'Hostel not found' });
      }

      const room = await Room.findById(roomId);
      if (!room || !room.isAvailable) {
        return res.status(400).json({ message: 'Room not available' });
      }

      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkIn);
      checkOut.setMonth(checkOut.getMonth() + totalMonthsStaying);

      const overlappingBookings = await Booking.find({
        roomId: roomId,
        status: { $in: ['pending', 'confirmed'] },
        $or: [
          { checkInDate: { $lte: checkOut, $gte: checkIn } },
          {
            $and: [
              { checkInDate: { $lte: checkIn } },
              {
                $expr: {
                  $gte: [
                    { $dateAdd: { startDate: '$checkInDate', unit: 'month', amount: '$totalMonthsStaying' } },
                    checkIn,
                  ],
                },
              },
            ],
          },
          {
            $and: [
              { checkInDate: { $lte: checkOut } },
              {
                $expr: {
                  $lte: [
                    { $dateAdd: { startDate: '$checkInDate', unit: 'month', amount: '$totalMonthsStaying' } },
                    checkOut,
                  ],
                },
              },
            ],
          },
        ],
      });

      if (overlappingBookings.length > 0) {
        return res.status(400).json({ message: 'Room is booked for the selected period' });
      }

      const totalAmount = room.monthlyPrice * totalMonthsStaying;
      const amountInPaisa = Math.round(totalAmount * 100);
      if (amountInPaisa < 1000) {
        return res.status(400).json({ message: 'Total amount must be at least Rs. 10 (1000 paisa) for payment' });
      }

      const booking = new Booking({
        userId: req.user.id,
        hostelId: req.params.hostelId,
        roomId: roomId,
        checkInDate,
        totalMonthsStaying,
        totalPrice: totalAmount,
        status: 'pending',
        paymentMethod: 'khalti',
      });

      await booking.save();

      const paymentInitate = await initializeKhaltiPayment({
        amount: amountInPaisa,
        purchase_order_id: booking._id.toString(),
        purchase_order_name: `Booking for ${hostel.name}`,
        return_url: `${process.env.BACKEND_URI}/complete-khalti-payment`,
        website_url: 'http://localhost:5173',
        customer_info: {
          name: req.user.name || 'Guest',
          email: req.user.email || 'guest@example.com',
          phone: '9800000001',
        },
      });

      booking.paymentId = paymentInitate.pidx;
      await booking.save();

      room.isAvailable = false;
      await room.save();

      await Hostel.findByIdAndUpdate(req.params.hostelId, {
        $push: { bookings: booking._id },
      });

      const populatedBooking = await Booking.findById(booking._id)
        .populate('userId', 'name email')
        .populate('hostelId', 'name')
        .populate('roomId', 'roomNumber roomType monthlyPrice');

      res.status(201).json({
        success: true,
        booking: populatedBooking,
        payment: paymentInitate,
      });
    } catch (err) {
      console.error('Error in /book:', err.response?.data || err.message);
      res.status(400).json({ success: false, message: 'Payment initiation failed', error: err.message });
    }
  }
);

// Verify payment callback
router.get('/complete-khalti-payment', async (req, res) => {
  const {
    pidx,
    transaction_id,
    purchase_order_id,
  } = req.query;

  try {
    const paymentInfo = await verifyKhaltiPayment(pidx);    if (
      paymentInfo?.status !== 'Completed' ||
      paymentInfo.transaction_id !== transaction_id
    ) {
      await Booking.findByIdAndUpdate(purchase_order_id, {
        $set: { status: 'cancelled', paymentStatus: 'failed' },
      });
      const booking = await Booking.findById(purchase_order_id);
      if (booking) {
        await Room.findByIdAndUpdate(booking.roomId, { isAvailable: true });
      }
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
        paymentInfo,
      });
    }

    const booking = await Booking.findById(purchase_order_id);
    if (!booking) {
      return res.status(400).json({
        success: false,
        message: 'Booking not found',
      });
    }    if (booking.totalPrice * 100 !== Number(paymentInfo.total_amount)) {
      await Booking.findByIdAndUpdate(purchase_order_id, {
        $set: { status: 'cancelled', paymentStatus: 'failed' },
      });
      await Room.findByIdAndUpdate(booking.roomId, { isAvailable: true });
      return res.status(400).json({
        success: false,
        message: 'Amount mismatch',
      });
    }

    await Booking.findByIdAndUpdate(purchase_order_id, {
      $set: { status: 'confirmed', paymentStatus: 'completed' },
    });

    const paymentData = {
      pidx,
      transactionId: transaction_id,
      productId: purchase_order_id,
      amount,
      dataFromVerificationReq: paymentInfo,
      apiQueryFromUser: req.query,
      paymentGateway: 'khalti',
      status: 'success',
    };

    res.json({
      success: true,
      message: 'Payment Successful',
      paymentData,
    });
  } catch (err) {
    console.error('Error in /complete-khalti-payment:', err.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: err.message,
    });
  }
});

// Get booking by ID
router.get('/booking/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('hostelId', 'name')
      .populate('roomId', 'roomNumber roomType monthlyPrice');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only allow the booking user or the hostel owner to access the details
    if (booking.userId.toString() !== req.user.id && 
        !(await Hostel.findOne({ _id: booking.hostelId, owner: req.user.id }))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Handle payment cancellation
router.post('/:bookingId/cancel-payment', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only allow cancellation by the booking user
    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.paymentStatus = 'cancelled';
    await booking.save();

    // Make room available again
    await Room.findByIdAndUpdate(booking.roomId, { isAvailable: true });

    res.json({ 
      success: true,
      message: 'Payment cancelled successfully'
    });
  } catch (err) {
    console.error('Error cancelling payment:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to cancel payment'
    });
  }
});

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('hostelId', 'name')
      .populate('roomId', 'roomNumber roomType monthlyPrice');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel a booking
router.delete('/:bookingId', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';

    await Room.findByIdAndUpdate(booking.roomId, { isAvailable: true });

    await booking.save();
    res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;