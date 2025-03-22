import React from 'react';
import { NavLink } from 'react-router-dom';
import HostelKhojauLogo from '../assets/HostelKhojauLogo.png'; 

const Navbar = () => {
  return (
    <nav className="sticky top-0 flex items-center justify-between py-4 px-8 bg-white border-b shadow-sm">
      {/* Left Section: Logo and Company Name */}
      <div className="flex items-center gap-3">
        {/* Logo */}
        <img src={HostelKhojauLogo} alt="Logo" className="h-20" /> {/* Increased logo size */}
        {/* Company Name */}
        <span className="text-2xl font-bold text-red-600 font-poppins">Hostel Khojau</span> 
      </div>

      {/* Right Section: Navigation Links */}
      <div className="flex items-center gap-8 ml-auto mr-16"> 
        <div className="flex space-x-8">
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
            to="/login"
            className={({ isActive }) =>
              isActive
                ? "text-black font-semibold text-lg underline underline-offset-4"
                : "text-gray-600 text-lg hover:text-black hover:underline hover:underline-offset-4 transition-all"
            }
          >
            Login
          </NavLink>
          <NavLink
            to="/register-hostel"
            className={({ isActive }) =>
              isActive
                ? "text-black font-semibold text-lg underline underline-offset-4"
                : "text-gray-600 text-lg hover:text-black hover:underline hover:underline-offset-4 transition-all"
            }
          >
            Register Hostel
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;