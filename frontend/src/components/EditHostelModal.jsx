import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditHostelModal = ({ hostel, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: hostel.name || '',
    location: hostel.location || '',
    city: hostel.city || '',
    description: hostel.description || '',
    hostelType: hostel.hostelType || '',
    priceRange: {
      min: hostel.priceRange?.min ? parseInt(hostel.priceRange.min, 10) : 0,
      max: hostel.priceRange?.max ? parseInt(hostel.priceRange.max, 10) : 0
    },
    amenities: hostel.amenities || [],
    mapEmbedUrl: hostel.mapEmbedUrl || '',
    contact: {
      phone: hostel.contact?.phone || '',
      email: hostel.contact?.email || ''
    },
    images: (hostel.images || []).map(url => ({ url, isExisting: true })),
    images360: (hostel.images360 || []).map(url => ({ url, isExisting: true }))
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      let newValue = value;
      
      if (parent === 'priceRange') {
        const numValue = parseInt(value, 10);
        newValue = isNaN(numValue) ? 0 : Math.max(0, numValue);
      }

      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: newValue }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAmenitiesChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, value]
        : prev.amenities.filter(a => a !== value)
    }));
  };
  const handleImagesChange = (e, field) => {
    const files = Array.from(e.target.files);
    const currentImages = formData[field].filter(img => img.isExisting);
    const maxImages = 3;
    
    if (field === 'images' && files.length + currentImages.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Clean up any existing preview URLs
    formData[field].forEach(image => {
      if (image.preview && !image.isExisting) {
        URL.revokeObjectURL(image.preview);
      }
    });    // Create preview URLs for new images
    const newImages = files.map(file => {
      const preview = URL.createObjectURL(file);
      return {
        file,
        preview,
        isExisting: false,
        timestamp: Date.now(),
        // Store the URL to clean up later
        _previewUrl: preview
      };
    });

    setFormData(prev => ({
      ...prev,
      [field]: [...currentImages, ...newImages]
    }));
  };
  const handleRemoveImage = (index, field) => {
    setFormData(prev => {
      const updatedImages = [...prev[field]];
      const removedImage = updatedImages[index];
      
      // Cleanup preview URL if it exists
      if (removedImage.preview) {
        URL.revokeObjectURL(removedImage.preview);
      }
      
      // Remove the image
      updatedImages.splice(index, 1);

      // If all images are removed, ensure the array is empty
      if (updatedImages.length === 0) {
        return {
          ...prev,
          [field]: []
        };
      }
      
      return {
        ...prev,
        [field]: updatedImages
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.location || !formData.city || !formData.description || !formData.hostelType) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate price range
    const minPrice = parseInt(formData.priceRange.min, 10);
    const maxPrice = parseInt(formData.priceRange.max, 10);
    
    if (isNaN(minPrice) || isNaN(maxPrice) || minPrice < 0 || maxPrice < 0) {
      toast.error('Please enter valid prices');
      return;
    }

    if (maxPrice < minPrice) {
      toast.error('Maximum price cannot be less than minimum price');
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Add basic text fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('hostelType', formData.hostelType);
      formDataToSend.append('mapEmbedUrl', formData.mapEmbedUrl);

      // Add objects as JSON strings
      formDataToSend.append('priceRange', JSON.stringify({ min: minPrice, max: maxPrice }));
      formDataToSend.append('contact', JSON.stringify(formData.contact));
      formDataToSend.append('amenities', JSON.stringify(formData.amenities));

      // Handle existing images
      const existingImages = formData.images
        .filter(img => img.isExisting)
        .map(img => img.url);
      
      const existingImages360 = formData.images360
        .filter(img => img.isExisting)
        .map(img => img.url);

      formDataToSend.append('existingImages', JSON.stringify(existingImages));
      formDataToSend.append('existingImages360', JSON.stringify(existingImages360));

      // Add new image files
      formData.images
        .filter(img => !img.isExisting)
        .forEach(img => formDataToSend.append('newImages', img.file));

      formData.images360
        .filter(img => !img.isExisting)
        .forEach(img => formDataToSend.append('newImages360', img.file));

      await onUpdate(formDataToSend);
      onClose();
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update hostel details');
    }
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      formData.images.forEach(image => {
        if (image.preview) URL.revokeObjectURL(image.preview);
      });
      formData.images360.forEach(image => {
        if (image.preview) URL.revokeObjectURL(image.preview);
      });
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit Hostel</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hostel Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hostel Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Location & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              required
            />
          </div>

          {/* Hostel Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hostel Type
            </label>
            <select
              name="hostelType"
              value={formData.hostelType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Type</option>
              <option value="Boys Hostel">Boys Hostel</option>
              <option value="Girls Hostel">Girls Hostel</option>
              <option value="Co-ed">Co-ed</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Price (Rs.)
              </label>
              <input
                type="number"
                name="priceRange.min"
                value={formData.priceRange.min}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                step="100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Price (Rs.)
              </label>
              <input
                type="number"
                name="priceRange.max"
                value={formData.priceRange.max}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={formData.priceRange.min}
                step="100"
                required
              />
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenities
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {['Wi-Fi', 'Food', 'Laundry', 'Parking', 'AC', 'Gym'].map((amenity) => (
                <label key={amenity} className="flex items-center text-gray-600">
                  <input
                    type="checkbox"
                    value={amenity}
                    checked={formData.amenities.includes(amenity)}
                    onChange={handleAmenitiesChange}
                    className="mr-2 h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Update Images (Max 3)
            </label>
            <input
              type="file"
              name="images"
              multiple
              accept="image/*"
              onChange={(e) => handleImagesChange(e, 'images')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {formData.images.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.preview || image.url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index, 'images')}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 360° Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Update 360° Images
            </label>
            <input
              type="file"
              name="images360"
              multiple
              accept="image/*"
              onChange={(e) => handleImagesChange(e, 'images360')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {formData.images360.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {formData.images360.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.preview || image.url}
                      alt={`360° Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index, 'images360')}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Map Embed URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Map Embed URL (Optional)
            </label>
            <input
              type="text"
              name="mapEmbedUrl"
              value={formData.mapEmbedUrl}
              onChange={handleChange}
              placeholder="Enter Google Maps embed URL"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                name="contact.phone"
                value={formData.contact.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                name="contact.email"
                value={formData.contact.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditHostelModal;
