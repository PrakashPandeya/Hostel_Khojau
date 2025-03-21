import React from 'react';
import { Search } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import HostelKhojauLogo from '../assets/HostelKhojauLogo.png'; // Ensure this path is correct

const Navbar = () => {
  return (
    <nav className="sticky top-0 flex items-center justify-between py-4 px-8 bg-white border-b shadow-sm">
      {/* Left Section: Logo and Company Name */}
      <div className="flex items-center gap-3">
        {/* Logo (unchanged) */}
        <img src={HostelKhojauLogo} alt="Logo" className="h-16" /> {/* Keep the logo as it is */}
        {/* Company Name in Red */}
        <span className="text-2xl font-bold text-red-600 font-poppins">Hostel Khojau</span> {/* Changed to red */}
      </div>

      {/* Right Section: Navigation Links, Search Bar, and Login Button */}
      <div className="flex items-center gap-8">
        {/* Navigation Links */}
        <div className="flex space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-black font-semibold text-lg underline underline-offset-4"
                : "text-gray-600 text-lg hover:text-black hover:underline hover:underline-offset-4 transition-all"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/hostel"
            className={({ isActive }) =>
              isActive
                ? "text-black font-semibold text-lg underline underline-offset-4"
                : "text-gray-600 text-lg hover:text-black hover:underline hover:underline-offset-4 transition-all"
            }
          >
            Hostels
          </NavLink>
          <NavLink
            to="/room"
            className={({ isActive }) =>
              isActive
                ? "text-black font-semibold text-lg underline underline-offset-4"
                : "text-gray-600 text-lg hover:text-black hover:underline hover:underline-offset-4 transition-all"
            }
          >
            Rooms
          </NavLink>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-64 px-4 py-2 bg-gray-100 rounded-full focus:outline-none placeholder-gray-400"
          />
          <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        {/* Login Button */}
        <button className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-red-700 hover:shadow-lg transition-all">
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;