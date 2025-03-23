import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const HostelPage = () => {
  const [hostels, setHostels] = useState([]); // All hostels data
  const [filteredHostels, setFilteredHostels] = useState([]); // Filtered hostels data
  const [filters, setFilters] = useState({
    name: '',
    institute: '',
    city: '',
    gender: '',
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
        (!filters.institute || hostel.institute === filters.institute) &&
        (!filters.city || hostel.city.toLowerCase().includes(filters.city.toLowerCase())) &&
        (!filters.gender || hostel.gender === filters.gender) &&
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
      institute: '',
      city: '',
      gender: '',
      priceRange: '',
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-8 py-6">
        {/* Filter Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
          <div className="flex items-center gap-4">
            {/* Filters */}
            <input type="text" name="name" value={filters.name} onChange={handleFilterChange} placeholder="Hostel Name" className="w-full px-4 py-2 border rounded-lg" />
            <select name="institute" value={filters.institute} onChange={handleFilterChange} className="w-full px-4 py-2 border rounded-lg">
              <option value="">Filter By Institute</option>
              <option value="Institute 1">Institute 1</option>
              <option value="Institute 2">Institute 2</option>
            </select>
            <input type="text" name="city" value={filters.city} onChange={handleFilterChange} placeholder="City" className="w-full px-4 py-2 border rounded-lg" />
            <select name="gender" value={filters.gender} onChange={handleFilterChange} className="w-full px-4 py-2 border rounded-lg">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select name="priceRange" value={filters.priceRange} onChange={handleFilterChange} className="w-full px-4 py-2 border rounded-lg">
              <option value="">Price Range</option>
              <option value="0-5000">0 - 5000</option>
              <option value="5000-10000">5000 - 10000</option>
            </select>
            <button onClick={handleReset} className="px-6 py-2 bg-red-500 text-white rounded-lg">Reset</button>
          </div>
        </div>

        {/* Hostels List */}
        <h2 className="text-lg font-semibold mb-4">Hostels Connected With Us</h2>
        {loading ? (
          <p>Loading hostels...</p>
        ) : filteredHostels.length === 0 ? (
          <p>No hostels found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHostels.map((hostel) => (
              <div key={hostel._id} className="bg-white rounded-lg shadow-md">
                <img src={hostel.image} alt={hostel.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-medium">{hostel.name}</h3>
                  <p className="text-sm text-gray-600">{hostel.city}</p>
                  <button className="w-full bg-red-500 text-white py-2 rounded-md mt-2">View More</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Google Maps Iframe */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Location</h2>
          <div className="w-full h-96 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d659.3639734833907!2d85.32542478861465!3d27.707615213544113!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1908434cb3c5%3A0x1fdf1a6d41d2512d!2sIslington%20College!5e0!3m2!1sen!2snp!4v1737220565479!5m2!1sen!2snp"
              className="w-full h-full"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HostelPage;