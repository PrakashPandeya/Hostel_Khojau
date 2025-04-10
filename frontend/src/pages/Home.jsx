import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeroImage from '../assets/HeroImage.jpg';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer';

const Home = () => {
  const navigate = useNavigate();
  const [hostels, setHostels] = useState([]); // All hostels data
  const [filteredHostels, setFilteredHostels] = useState([]); // Filtered hostels data
  const [filters, setFilters] = useState({
    name: '',
    location: '',
    hostelType: '',
    priceRange: '',
  });
  const [loading, setLoading] = useState(true);

  // Fetch all hostels on mount
  useEffect(() => {
    const fetchAllHostels = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/hostels');
        setHostels(response.data);
        setFilteredHostels(response.data); // Initially, filtered data is the same as all data
        console.log('Fetched hostels:', response.data);
      } catch (error) {
        console.error('Error fetching hostels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllHostels();
  }, []);

  // Apply filters
  useEffect(() => {
    const filtered = hostels.filter((hostel) => {
      return (
        (!filters.name || hostel.name.toLowerCase().includes(filters.name.toLowerCase())) &&
        (!filters.location || hostel.location.toLowerCase().includes(filters.location.toLowerCase())) &&
        (!filters.hostelType || hostel.hostelType === filters.hostelType) &&
        (!filters.priceRange || checkPriceRange(hostel.price, filters.priceRange))
      );
    });

    setFilteredHostels(filtered);
  }, [filters, hostels]);

  // Function to check if hostel price falls within the selected range
  const checkPriceRange = (price, range) => {
    if (!range) return true;
    const [min, max] = range.split('-').map(Number);
    return price >= min && price <= max;
  };

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Reset filters
  const handleReset = () => {
    setFilters({
      name: '',
      location: '',
      hostelType: '',
      priceRange: '',
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8">
        {/* Hero Section */}
        <div className="py-8">
          <div className="flex items-stretch gap-8">
            <div className="w-1/2 bg-gray-50 p-12 rounded-lg flex flex-col justify-center">
              <h1 className="text-5xl font-bold mb-4">Looking for a place to Accommodate</h1>
              <p className="text-gray-600 mb-8 text-lg">Explore hostels on Hostel Khojau</p>
              <button 
                onClick={() => navigate('/hostel')}
                className="bg-red-500 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-red-600 transition-colors w-fit"
              >
                View Hostels
              </button>
            </div>
            <div className="w-1/2">
              <img 
                src={HeroImage} 
                alt="Hostel illustration" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Search Filter Section - Replaced the old search bar */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
          <div className="flex items-center gap-4">
            {/* Filters */}
            <input 
              type="text" 
              name="name" 
              value={filters.name} 
              onChange={handleFilterChange} 
              placeholder="Hostel Name" 
              className="w-full px-4 py-2 border rounded-lg" 
            />
            <input 
              type="text" 
              name="location" 
              value={filters.location} 
              onChange={handleFilterChange} 
              placeholder="Location" 
              className="w-full px-4 py-2 border rounded-lg" 
            />
            <select 
              name="hostelType" 
              value={filters.hostelType} 
              onChange={handleFilterChange} 
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Select Hostel Type</option>
              <option value="Male">Boys Hostel</option>
              <option value="Female">Girls Hostel</option>
            </select>
            <select 
              name="priceRange" 
              value={filters.priceRange} 
              onChange={handleFilterChange} 
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Price Range</option>
              <option value="10000-12000">10000-12000</option>
              <option value="10000-15000">10000-15000</option>
              <option value="12000-15000">12000-15000</option>
            </select>
            <button 
              onClick={handleReset} 
              className="px-6 py-2 bg-blue-500 text-white rounded-lg"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Show filtered hostels preview */}
        {!loading && filteredHostels.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg font-semibold mb-4">Featured Hostels</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHostels.slice(0, 3).map((hostel) => (
                <div key={hostel._id} className="bg-white rounded-lg shadow-md">
                  <img src={hostel.image} alt={hostel.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-medium">{hostel.name}</h3>
                    <p className="text-sm text-gray-600">{hostel.location}</p>
                    <button 
                      onClick={() => navigate(`/hostel/${hostel._id}`)}
                      className="w-full bg-red-500 text-white py-2 rounded-md mt-2"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {filteredHostels.length > 3 && (
              <div className="text-center mt-6">
                <button 
                  onClick={() => navigate('/hostel')}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg"
                >
                  View All Hostels
                </button>
              </div>
            )}
          </div>
        )}

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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
