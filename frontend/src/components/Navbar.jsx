import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import HostelKhojauLogo from '../assets/HostelKhojauLogo.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/home');
  };

  return (
    <nav className="sticky top-0 flex items-center justify-between py-4 px-8 bg-white border-b shadow-sm z-10">
      {/* Left Section: Logo and Company Name */}
      <div className="flex items-center gap-3">
        <NavLink to="/home">
          <img src={HostelKhojauLogo} alt="Hostel Khojau Logo" className="h-20" />
        </NavLink>
        <span className="text-2xl font-bold text-red-600 font-poppins">Hostel Khojau</span>
      </div>

      {/* Right Section: Navigation Links */}
      <div className="flex items-center gap-8 ml-auto mr-16">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            isActive
              ? "text-black font-semibold text-lg underline underline-offset-4 font-poppins"
              : "text-gray-600 text-lg hover:text-black hover:underline hover:underline-offset-4 transition-all font-poppins"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/hostel"
          className={({ isActive }) =>
            isActive
              ? "text-black font-semibold text-lg underline underline-offset-4 font-poppins"
              : "text-gray-600 text-lg hover:text-black hover:underline hover:underline-offset-4 transition-all font-poppins"
          }
        >
          Hostels
        </NavLink>
        {user && user.role === 'owner' && (
          <>
            <NavLink
              to="/register-hostel"
              className={({ isActive }) =>
                isActive
                  ? "text-black font-semibold text-lg underline underline-offset-4 font-poppins"
                  : "text-gray-600 text-lg hover:text-black hover:underline hover:underline-offset-4 transition-all font-poppins"
              }
            >
              Register Hostel
            </NavLink>
            <NavLink
              to="/owner/hostels"
              className={({ isActive }) =>
                isActive
                  ? "text-black font-semibold text-lg underline underline-offset-4 font-poppins"
                  : "text-gray-600 text-lg hover:text-black hover:underline hover:underline-offset-4 transition-all font-poppins"
              }
            >
              Owner Dashboard
            </NavLink>
          </>
        )}
        {user && user.role === 'admin' && (
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              isActive
                ? "text-black font-semibold text-lg underline underline-offset-4 font-poppins"
                : "text-gray-600 text-lg hover:text-black hover:underline hover:underline-offset-4 transition-all font-poppins"
            }
          >
            Admin Dashboard
          </NavLink>
        )}
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200 font-poppins"
          >
            Logout
          </button>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive
                  ? "text-black font-semibold text-lg underline underline-offset-4 font-poppins"
                  : "text-gray-600 text-lg hover:text-black hover:underline hover:underline-offset-4 transition-all font-poppins"
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className={({ isActive }) =>
                isActive
                  ? "text-black font-semibold text-lg underline underline-offset-4 font-poppins"
                  : "text-gray-600 text-lg hover:text-black hover:underline hover:underline-offset-4 transition-all font-poppins"
              }
              >
              Sign Up
            </NavLink>
          </>
        )}
      </div>
      <ToastContainer />
    </nav>
  );
};

export default Navbar;