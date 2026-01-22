const express = require('express');
const router = express.Router();
const Hostel = require('../models/Hostel');
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Function to remove old image files
const removeOldImages = (oldImages, newImages) => {
  oldImages.forEach(img => {
    if (!newImages.includes(img)) {
      const imagePath = path.join(__dirname, '../../frontend/public', new URL(img, 'http://localhost:5000').pathname);
      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, err => {
          if (err) console.error('Error deleting old image:', err);
        });
      }
    }
  });
};

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
    authorize('owner', 'admin'),    upload.fields([
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
      const baseUrl = 'http://localhost:5000'; // TODO: Replace with env variable
      const newImageUrls = req.files['newImages'] 
        ? req.files['newImages'].map(file => `${baseUrl}/images/hostels/${file.filename}`)
        : [];
      
      const newImage360Urls = req.files['newImages360']
        ? req.files['newImages360'].map(file => `${baseUrl}/images/hostels/${file.filename}`)
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

      // Remove old images that are no longer used
      removeOldImages(hostel.images, updatedData.images);
      removeOldImages(hostel.images360, updatedData.images360);

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

module.exports = router;
