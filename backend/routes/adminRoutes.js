const express = require('express');
const router = express.Router();
const Hostel = require('../models/Hostel');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/auth');

// Get all pending hostels
router.get('/hostels/pending', [auth, authorize('admin')], async (req, res) => {
  try {
    const hostels = await Hostel.find({ status: 'pending' }).populate('owner', 'name email');
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

    hostel.status = 'active';
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

    hostel.status = 'rejected';
    await hostel.save();

    res.json({ message: 'Hostel rejected' });
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

// Get all pending owners
router.get('/pending-owners', [auth, authorize('admin')], async (req, res) => {
  try {
    const pendingOwners = await User.find({ role: 'owner', isApproved: false });
    res.json(pendingOwners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve an owner
router.put('/approve-owner/:id', [auth, authorize('admin')], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'owner') {
      return res.status(404).json({ message: 'Owner not found' });
    }

    user.isApproved = true;
    await user.save();

    // Activate the owner's pending hostels
    await Hostel.updateMany(
      { owner: user._id, status: 'pending' },
      { status: 'active' }
    );

    res.json({ message: 'Owner approved successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;