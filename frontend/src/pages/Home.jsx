import React from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import HeroImage from '../assets/HeroImage.jpg';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer';

const Home = () => {
  const navigate = useNavigate(); 

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

        {/* Search Bar */}
        <div className="bg-blue-500 rounded-lg p-4 flex items-center gap-4 mb-8">
          <div className="flex-1">
            <input type="text" placeholder="Location" className="w-full bg-transparent border-b border-white text-white placeholder-white/70 outline-none" />
          </div>
          <div className="flex-1">
            <input type="date" className="w-full bg-transparent border-b border-white text-white outline-none [color-scheme:dark]" />
          </div>
          <div className="flex-1">
            <input type="date" className="w-full bg-transparent border-b border-white text-white outline-none [color-scheme:dark]" />
          </div>
          <button className="bg-white p-2 rounded-full">
            <Search className="text-blue-500 h-5 w-5" />
          </button>
        </div>

        {/* Top Rated Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Top Rated Hostel</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="bg-gray-50 p-4 rounded-lg flex gap-4">
                <div className="bg-gray-200 w-48 h-32 rounded-lg flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Hostel {num}</h3>
                  <p className="text-gray-600 text-sm mb-2">Modern accommodation with great amenities</p>
                  <div className="flex justify-between items-end">
                    <div className="text-yellow-400">★★★★</div>
                    <button className="bg-red-500 text-white px-4 py-1 rounded text-sm">View More</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Nearby Hostels</h2>
            <button className="text-gray-600 text-sm">Show more</button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[4, 5, 6].map((num) => (
              <div key={num} className="bg-gray-50 rounded-lg">
                <div className="bg-gray-200 h-32 rounded-t-lg" />
                <div className="p-3">
                  <h3 className="font-medium">Hostel {num}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Register Hostel Section */}
        <div className="bg-blue-50 rounded-lg p-8 mb-12 text-center">
          <h2 className="text-2xl font-bold mb-2">Register a Hostel for Free?</h2>
          <p className="text-gray-600 mb-6 text-lg">
            "Get your Hostel Online at our website by registering Here for Free!"
          </p>
          <button
            onClick={() => navigate('/register-hostel')} // Update with your actual registration route
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