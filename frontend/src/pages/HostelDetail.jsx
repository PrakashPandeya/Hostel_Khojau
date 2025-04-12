import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HostelDetail = () => {
  const { id } = useParams();
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHostel = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/hostels/${id}`);
        setHostel(response.data);
      } catch (err) {
        setError('Failed to fetch hostel details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHostel();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p>Loading hostel details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-red-500">{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hostel Images */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
              {hostel.images.map((img, index) => (
                <img 
                  key={index}
                  src={img} 
                  alt={`${hostel.name} ${index + 1}`}
                  className="w-full h-64 object-cover"
                />
              ))}
            </div>
            {hostel.isFeatured && (
              <div className="absolute top-4 left-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                Featured
              </div>
            )}
          </div>

          {/* Hostel Details */}
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2">{hostel.name}</h1>
            <p className="text-gray-600 mb-4">
              {hostel.location}, {hostel.city}
            </p>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                {hostel.hostelType}
              </div>
              <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                Rs. {hostel.priceRange.min} - Rs. {hostel.priceRange.max}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{hostel.description}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {hostel.amenities.map((amenity, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Contact</h2>
              <p className="text-gray-700">
                <span className="font-medium">Phone:</span> {hostel.contact.phone}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Email:</span> {hostel.contact.email}
              </p>
            </div>

            <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition duration-200">
              Contact Hostel
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HostelDetail;