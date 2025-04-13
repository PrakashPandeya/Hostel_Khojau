import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeroImage from '../assets/HeroImage.jpg';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer';
import RegisterHostel  from '../components/RegisterHostel';



const Home = () => {
  const navigate = useNavigate();
  const [featuredHostels, setFeaturedHostels] = useState([]);
  const [allHostels, setAllHostels] = useState([]);
  const [filteredHostels, setFilteredHostels] = useState([]);
  const [loading, setLoading] = useState({
    featured: true,
    all: false
  });
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    location: '',
    hostelType: '',
    priceRange: '',
  });

  // Fetch featured hostels on mount
  useEffect(() => {
    const fetchFeaturedHostels = async () => {
      try {
        setLoading(prev => ({...prev, featured: true}));
        const response = await axios.get('http://localhost:5000/api/hostels?featured=true');
        setFeaturedHostels(response.data);
        setFilteredHostels(response.data);
      } catch (error) {
        console.error('Error fetching featured hostels:', error);
      } finally {
        setLoading(prev => ({...prev, featured: false}));
      }
    };

    fetchFeaturedHostels();
  }, []);

  // Fetch all hostels when filters are applied
  useEffect(() => {
    const fetchAllHostels = async () => {
      try {
        setLoading(prev => ({...prev, all: true}));
        const response = await axios.get('http://localhost:5000/api/hostels');
        setAllHostels(response.data);
        applyFilters(response.data);
      } catch (error) {
        console.error('Error fetching all hostels:', error);
      } finally {
        setLoading(prev => ({...prev, all: false}));
      }
    };

    const hasFilters = Object.values(filters).some(value => value !== '');
    if (hasFilters) {
      setIsSearching(true);
      fetchAllHostels();
    } else {
      setIsSearching(false);
      setFilteredHostels(featuredHostels);
    }
  }, [filters]);

  const applyFilters = (hostelsToFilter) => {
    const filtered = hostelsToFilter.filter((hostel) => {
      // Name filter (case insensitive)
      const matchesName = !filters.name || 
        hostel.name.toLowerCase().includes(filters.name.toLowerCase());
      
      // Location filter (case insensitive)
      const matchesLocation = !filters.location || 
        hostel.location.toLowerCase().includes(filters.location.toLowerCase());
      
      // Hostel type filter (exact match)
      const matchesType = !filters.hostelType || 
        hostel.hostelType.toLowerCase() === filters.hostelType.toLowerCase();
      
      // Price range filter
      let matchesPrice = true;
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        
        // Check both possible price structures
        if (hostel.price) {
          // Single price value
          matchesPrice = hostel.price >= min && hostel.price <= max;
        } else if (hostel.priceRange) {
          // Price range object
          matchesPrice = hostel.priceRange.min <= max && hostel.priceRange.max >= min;
        } else {
          matchesPrice = false;
        }
      }

      return matchesName && matchesLocation && matchesType && matchesPrice;
    });
    setFilteredHostels(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  const handleReset = () => {
    setFilters({
      name: '',
      location: '',
      hostelType: '',
      priceRange: '',
    });
    setIsSearching(false);
    setFilteredHostels(featuredHostels);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
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

        {/* Search Filter Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
          <div className="flex items-center gap-4">
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
              <option value="Boys Hostel">Boys Hostel</option>
              <option value="Girls Hostel">Girls Hostel</option>
            </select>
            <select 
              name="priceRange" 
              value={filters.priceRange} 
              onChange={handleFilterChange} 
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Price Range</option>
              <option value="10000-12000">Rs. 10,000 - Rs. 12,000</option>
              <option value="10000-15000">Rs. 10,000 - Rs. 15,000</option>
              <option value="12000-15000">Rs. 12,000 - Rs. 15,000</option>
            </select>
            <button 
              onClick={handleReset} 
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Hostels Display Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            {isSearching ? 'Search Results' : 'Featured Hostels'}
          </h2>
          
          {loading.featured && !isSearching ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-lg">Loading featured hostels...</p>
            </div>
          ) : loading.all && isSearching ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-lg">Searching hostels...</p>
            </div>
          ) : filteredHostels.length === 0 ? (
            <p className="text-lg">No hostels found matching your criteria.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHostels.slice(0, isSearching ? filteredHostels.length : 3).map((hostel) => (
                  <div key={hostel._id} className={`bg-white rounded-lg shadow-md overflow-hidden ${!isSearching && 'border-2 border-yellow-400'}`}>
                    <div className="relative h-48">
                      <img 
                        src={hostel.images?.[0] || 'https://via.placeholder.com/400x300'} 
                        alt={hostel.name} 
                        className="w-full h-full object-cover"
                      />
                      {!isSearching && (
                        <div className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1">{hostel.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        <span className="font-medium">Location:</span> {hostel.location}, {hostel.city}
                      </p>
                      <p className="text-gray-600 text-sm mb-2">
                        <span className="font-medium">Type:</span> {hostel.hostelType === 'Boys' ? 'Boys Hostel' : 'Girls Hostel'}
                      </p>
                      <p className="text-gray-600 text-sm mb-3">
                        <span className="font-medium">Price:</span> 
                        {hostel.price ? 
                          `Rs. ${hostel.price.toLocaleString()}` : 
                          hostel.priceRange ? 
                          `Rs. ${hostel.priceRange.min?.toLocaleString()} - Rs. ${hostel.priceRange.max?.toLocaleString()}` : 
                          'N/A'}
                      </p>
                      <button 
                        onClick={() => navigate(`/hostels/${hostel._id}`)}
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md transition duration-200"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {!isSearching && (
                <div className="text-center mt-6">
                  <button 
                    onClick={() => navigate('/hostel')}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    View All Hostels
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        
        <RegisterHostel />
        
      </main>
      <Footer />
    </div>
  );
};

export default Home;