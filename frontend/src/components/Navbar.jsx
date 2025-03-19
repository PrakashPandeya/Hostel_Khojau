// Navbar.jsx
import React from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import HostelKhojauLogo from '../assets/HostelKhojauLogo.png'; // Ensure this path is correct

const Navbar = () => {
  return (
    <nav className="sticky top-0 flex items-center justify-between py-4 px-8 bg-white border-b">
      <div className="flex items-center gap-12">
        <div className="flex items-center">
          {/* Replace with placeholder if image not loading */}
          {HostelKhojauLogo ? (
            <img src={HostelKhojauLogo} alt="Logo" className="h-10" />
          ) : (
            <div className="h-10 w-10 bg-gray-300 flex items-center justify-center rounded">
              <span>Logo</span>
            </div>
          )}
        </div>
        <div className="flex space-x-8">
          {/* Fix navigation links to use React Router properly */}
          <Link to="/" className="text-black font-semibold text-lg">Home</Link>
          <Link to="/hostel" className="text-gray-600 text-lg">Hostels</Link>
          <Link to="/room" className="text-gray-600 text-lg">Rooms</Link>
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
  );
};

export default Navbar;