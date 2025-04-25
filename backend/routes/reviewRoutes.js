const express = require('express');
const router = express.Router();
const Hostel = require('../models/Hostel');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// Submit a review for a hostel
router.post(
  '/:hostelId/reviews',
  [
    auth, // Ensure the user is authenticated
    check('comment', 'Comment is required').not().isEmpty(),
    check('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { comment, rating } = req.body;

    try {
      const hostel = await Hostel.findById(req.params.hostelId);
      if (!hostel) {
        return res.status(404).json({ message: 'Hostel not found' });
      }

      const newReview = {
        userId: req.user.id, // From auth middleware
        comment,
        rating,
        createdAt: new Date(),
      };

      hostel.reviews.push(newReview);
      await hostel.save();

      // Populate the userId field in the reviews array for the response
      const updatedHostel = await Hostel.findById(req.params.hostelId)
        .populate('reviews.userId', 'name')
        .lean();

      res.json(updatedHostel);
    } catch (err) {
      console.error('Error submitting review:', err.message);
      res.status(500).json({ message: 'Failed to submit review: ' + err.message });
    }
  }
);

// Delete a review (used by OwnerDashboard)
router.delete('/:hostelId/reviews/:reviewId', auth, async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.hostelId);
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }

    // Check if the user is the owner of the hostel
    if (hostel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Find and remove the review
    const reviewIndex = hostel.reviews.findIndex(
      (review) => review._id.toString() === req.params.reviewId
    );
    if (reviewIndex === -1) {
      return res.status(404).json({ message: 'Review not found' });
    }

    hostel.reviews.splice(reviewIndex, 1);
    await hostel.save();

    // Populate the userId field in the reviews array for the response
    const updatedHostel = await Hostel.findById(req.params.hostelId)
      .populate('reviews.userId', 'name')
      .lean();

    res.json(updatedHostel);
  } catch (err) {
    console.error('Error deleting review:', err.message);
    res.status(500).json({ message: 'Failed to delete review: ' + err.message });
  }
});

module.exports = router;