import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { Link } from 'react-router-dom';

const HostelPage = () => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all hostels
  useEffect(() => {
    const fetchHostels = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/hostels');
        setHostels(response.data);
      } catch (error) {
        console.error('Error fetching hostels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHostels();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* All Hostels */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Hostels Connected With Us</h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg">Loading hostels...</p>
            </div>
          ) : hostels.length === 0 ? (
            <p className="text-lg">No hostels found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hostels.map((hostel) => (
                <HostelCard key={hostel._id} hostel={hostel} />
              ))}
            </div>
          )}
        </div>

      {/* Register Hostel Section */}
        <div className="bg-blue-50 rounded-lg p-8 mb-12 text-center">
          <h2 className="text-2xl font-bold mb-2">Register a Hostel for Free?</h2>
          <p className="text-gray-600 mb-6 text-lg">
            "Get your Hostel Online at our website by registering Here for Free!"
          </p>
          <button
            onClick={() => navigate('/register-hostel')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-full transition-colors"
          >
            Register Here
          </button>
        </div>  
      </main>

      <Footer />
    </div>
  );
};

// Hostel Card Component
const HostelCard = ({ hostel }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      <div className="relative">
        <img 
          src={hostel.images[0] || 'https://via.placeholder.com/400x300'} 
          alt={hostel.name} 
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{hostel.name}</h3>
        <p className="text-gray-600 text-sm mb-2">
          <span className="font-medium">Location:</span> {hostel.location}, {hostel.city}
        </p>
        <p className="text-gray-600 text-sm mb-2">
          <span className="font-medium">Type:</span> {hostel.hostelType}
        </p>
        <p className="text-gray-600 text-sm mb-3">
          <span className="font-medium">Price:</span> Rs. {hostel.priceRange.min} - Rs. {hostel.priceRange.max}
        </p>
        <Link 
          to={`/hostels/${hostel._id}`}
          className="block w-full bg-red-500 hover:bg-red-600 text-white text-center py-2 rounded-md transition duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default HostelPage;