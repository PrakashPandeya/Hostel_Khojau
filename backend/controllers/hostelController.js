const express = require('express');
const router = express.Router();
const Hostel = require('../models/Hostel');
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/auth');
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

// Update hostel
router.put(
  '/:id',
  [
    auth,
    authorize('owner', 'admin'),
    upload.fields([
      { name: 'images', maxCount: 3 },
      { name: 'images360', maxCount: 3 }
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
      const amenities = JSON.parse(req.body.amenities);

      // Process uploaded files if they exist
      const imageUrls = req.files['images'] 
        ? req.files['images'].map(file => `/images/hostels/${file.filename}`)
        : hostel.images;
      
      const image360Urls = req.files['images360']
        ? req.files['images360'].map(file => `/images/hostels/${file.filename}`)
        : hostel.images360;

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
