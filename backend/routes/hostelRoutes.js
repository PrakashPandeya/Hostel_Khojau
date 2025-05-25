const express = require('express');
const router = express.Router();
const Hostel = require('../models/Hostel');
const Room = require('../models/Room');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../frontend/public/images/hostels');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Get all hostels
router.get('/', async (req, res) => {
  try {
    const query = req.query.featured === 'true' ? { isFeatured: true } : {};
    const hostels = await Hostel.find(query)
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
    upload.fields([
      { name: 'images', maxCount: 3 },
      { name: 'images360', maxCount: 3 }
    ])
  ],
  async (req, res) => {
    try {
      // Parse JSON strings back to objects
      const priceRange = JSON.parse(req.body.priceRange);
      const contact = JSON.parse(req.body.contact);
      const amenities = JSON.parse(req.body.amenities);

      // Validate the data
      if (!req.body.name || !req.body.location || !req.body.city || !req.body.hostelType) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      if (!priceRange.min || !priceRange.max) {
        return res.status(400).json({ message: 'Price range is required' });
      }

      const user = await User.findById(req.user.id);
      
      // Process uploaded files
      const imageUrls = req.files['images'] 
        ? req.files['images'].map(file => `/images/hostels/${file.filename}`)
        : [];
      
      const image360Urls = req.files['images360']
        ? req.files['images360'].map(file => `/images/hostels/${file.filename}`)
        : [];

      const hostelData = {
        name: req.body.name,
        location: req.body.location,
        city: req.body.city,
        description: req.body.description,
        hostelType: req.body.hostelType,
        priceRange,
        contact,
        amenities,
        mapEmbedUrl: req.body.mapEmbedUrl,
        owner: req.user.id,
        status: user.isApproved ? 'active' : 'pending',
        images: imageUrls,
        images360: image360Urls,
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
router.put(  '/:id',
  [
    auth,
    authorize('owner', 'admin'),
    upload.fields([
      { name: 'newImages', maxCount: 3 },
      { name: 'newImages360', maxCount: 3 }
    ])
  ],
  async (req, res) => {
    try {
      const hostel = await Hostel.findById(req.params.id);
      if (!hostel) {
        return res.status(404).json({ message: 'Hostel not found' });
      }

      if (req.user.role !== 'admin' && hostel.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      const priceRange = JSON.parse(req.body.priceRange);
      const contact = JSON.parse(req.body.contact);
      const amenities = JSON.parse(req.body.amenities);      // Handle existing and new images
      const existingImages = JSON.parse(req.body.existingImages || '[]');
      const existingImages360 = JSON.parse(req.body.existingImages360 || '[]');

      // Process new uploaded files
      const newImageUrls = req.files['newImages'] 
        ? req.files['newImages'].map(file => `/images/hostels/${file.filename}`)
        : [];
      
      const newImage360Urls = req.files['newImages360']
        ? req.files['newImages360'].map(file => `/images/hostels/${file.filename}`)
        : [];

      // Combine existing and new images
      const imageUrls = [...existingImages, ...newImageUrls];
      const image360Urls = [...existingImages360, ...newImage360Urls];

      const updatedData = {
        name: req.body.name,
        location: req.body.location,
        city: req.body.city,
        description: req.body.description,
        hostelType: req.body.hostelType,
        priceRange,
        contact,
        amenities,
        mapEmbedUrl: req.body.mapEmbedUrl,
        images: imageUrls,
        images360: image360Urls
      };

      // Update the hostel
      Object.assign(hostel, updatedData);
      const updatedHostel = await hostel.save();
      
      res.json(updatedHostel);
    } catch (err) {
      console.error('Error updating hostel:', err);
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