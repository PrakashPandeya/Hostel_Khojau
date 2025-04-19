const express = require('express');
const router = express.Router();
const Hostel = require('../models/Hostel');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/auth');

// Get all pending hostels
router.get('/hostels/pending', [auth, authorize('admin')], async (req, res) => {
  try {
    const hostels = await Hostel.find({ isApproved: false }).populate('owner', 'name email');
    res.json(hostels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve hostel
router.put('/hostels/:id/approve', [auth, authorize('admin')], async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }

    hostel.isApproved = true;
    hostel.approvedBy = req.user.id;
    hostel.approvedAt = new Date();
    await hostel.save();

    res.json(hostel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Reject hostel
router.put('/hostels/:id/reject', [auth, authorize('admin')], async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }

    await hostel.deleteOne(); // Remove rejected hostel
    res.json({ message: 'Hostel rejected and removed' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all users
router.get('/users', [auth, authorize('admin')], async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;