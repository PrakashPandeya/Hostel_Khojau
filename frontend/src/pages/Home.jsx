import React from 'react';
import { Search } from 'lucide-react';
import HostelKhojauLogo from '../assets/HostelKhojauLogo.png';
import HeroImage from '../assets/HeroImage.jpg';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 flex items-center justify-between py-4 px-8 bg-white border-b">
        <div className="flex items-center gap-12">
          <div className="flex items-center">
            <img src={HostelKhojauLogo} alt="Logo" className="h-10" />
          </div>
          <div className="flex space-x-8">
            <a href="#" className="text-black font-semibold text-lg">Home</a>
            <a href="./hostel/" className="text-gray-600 text-lg">Hostels</a>
            <a href="./room/" className="text-gray-600 text-lg">Rooms</a>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-64 px-4 py-2 bg-gray-100 rounded-full focus:outline-none"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <button className="p-2">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8">
        {/* Hero Section */}
        <div className="py-8">
          <div className="flex items-stretch gap-8">
            <div className="w-1/2 bg-gray-50 p-12 rounded-lg flex flex-col justify-center">
              <h1 className="text-5xl font-bold mb-4">Looking for a place to Accomodate</h1>
              <p className="text-gray-600 mb-8 text-lg">Explore hostels on Hostel Khojau</p>
              <button className="bg-red-500 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-red-600 transition-colors w-fit">
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
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 mt-8">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="grid grid-cols-3 gap-12">
            <div className="space-y-6">
              <div className="flex items-center">
                <img src={HostelKhojauLogo} alt="Logo" className="h-10 w-10" />
                <span className="ml-3 text-lg">Hostel Khojau</span>
              </div>
              <div className="flex space-x-6">
                {/* Social media icons remain the same */}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">CONTACT US</h3>
              <div className="space-y-2">
                <p className="text-gray-600">HostelKhojau@gmail.com</p>
                <p className="text-gray-600">Kathmandu, Nepal</p>
                <p className="text-gray-600">+01 5236123</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Want to Connect?</h3>
              <p className="text-gray-600 mb-4">
                Be the first to know about hostels, special discounts, store openings,
                and much more. Connect with us.
              </p>
              <div className="relative">
                <input type="email" placeholder="Email" className="w-full px-4 py-2 bg-gray-200 rounded-lg focus:outline-none" />
                <button className="absolute right-2 top-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                    <path d="M22 2L11 13"></path>
                    <path d="M22 2L15 22 11 13 2 9l20-7z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;