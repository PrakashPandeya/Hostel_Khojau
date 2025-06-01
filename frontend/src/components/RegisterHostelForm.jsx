import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const RegisterHostelForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    city: '',
    description: '',
    hostelType: '',
    priceRange: { min: '', max: '' },
    amenities: [],
    mapEmbedUrl: '',
    contact: { phone: '', email: '' },
    images: [],
    images360: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAmenitiesChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, value]
        : prev.amenities.filter((a) => a !== value),
    }));
  };

  const handleImagesChange = (e, field) => {
    const files = Array.from(e.target.files);
    
    if (field === 'images' && files.length + formData[field].length > 3) {
      toast.error('You can upload a maximum of 3 images.');
      return;
    }

    // Create object URLs for preview
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ...newImages],
    }));
  };

  const handleRemoveImage = (index, field) => {
    setFormData((prev) => {
      const updatedImages = prev[field].filter((_, i) => i !== index);
      // Revoke the object URL to avoid memory leaks
      if (prev[field][index]?.preview) {
        URL.revokeObjectURL(prev[field][index].preview);
      }
      return {
        ...prev,
        [field]: updatedImages,
      };
    });
  };

  useEffect(() => {
    // Cleanup object URLs when component unmounts
    return () => {
      formData.images.forEach(image => {
        if (image.preview) URL.revokeObjectURL(image.preview);
      });
      formData.images360.forEach(image => {
        if (image.preview) URL.revokeObjectURL(image.preview);
      });
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login as owner to register a hostel');
      setTimeout(() => navigate('/login'), 1000);
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Add basic fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('hostelType', formData.hostelType);
      formDataToSend.append('mapEmbedUrl', formData.mapEmbedUrl);

      // Add nested objects as JSON strings
      formDataToSend.append('priceRange', JSON.stringify(formData.priceRange));
      formDataToSend.append('contact', JSON.stringify(formData.contact));
      formDataToSend.append('amenities', JSON.stringify(formData.amenities));

      // Add image files
      formData.images.forEach((image) => {
        formDataToSend.append('images', image.file);
      });

      // Add 360° image files
      formData.images360.forEach((image) => {
        formDataToSend.append('images360', image.file);
      });

      const response = await axios.post('/api/hostels', formDataToSend, {
        headers: { 
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data'
        },
      });      if (response.data) {
        toast.success('Hostel successfully registered');
        setTimeout(() => navigate('/owner/hostels'), 1000);
      }
    } catch (err) {
      console.error('Registration error:', err.response?.data);
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Register Your Hostel</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md rounded-lg p-6">
          {/* Hostel Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Hostel Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
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
            <label htmlFor="hostelType" className="block text-sm font-medium text-gray-700 mb-1">
              Hostel Type
            </label>
            <select
              id="hostelType"
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
              <label
                htmlFor="priceRange.min"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Minimum Price
              </label>
              <input
                type="number"
                id="priceRange.min"
                name="priceRange.min"
                value={formData.priceRange.min}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="priceRange.max"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Maximum Price
              </label>
              <input
                type="number"
                id="priceRange.max"
                name="priceRange.max"
                value={formData.priceRange.max}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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

          {/* Images Upload (up to 3) */}
          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
              Upload Images (Up to 3)
            </label>
            <input
              type="file"
              id="images"
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
                      src={image.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index, 'images')}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 360-Degree Images Upload */}
          <div>
            <label htmlFor="images360" className="block text-sm font-medium text-gray-700 mb-1">
              Upload 360-Degree Images (Optional)
            </label>
            <input
              type="file"
              id="images360"
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
                      src={image.preview}
                      alt={`360° Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index, 'images360')}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center"
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
            <label
              htmlFor="mapEmbedUrl"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Map Embed URL (Optional)
            </label>
            <input
              type="url"
              id="mapEmbedUrl"
              name="mapEmbedUrl"
              value={formData.mapEmbedUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter Google Maps embed URL"
            />
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="contact.phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contact Phone
              </label>
              <input
                type="tel"
                id="contact.phone"
                name="contact.phone"
                value={formData.contact.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="contact.email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contact Email
              </label>
              <input
                type="email"
                id="contact.email"
                name="contact.email"
                value={formData.contact.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg transition-colors"
            >
              Submit for Approval
            </button>
          </div>
        </form>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default RegisterHostelForm;