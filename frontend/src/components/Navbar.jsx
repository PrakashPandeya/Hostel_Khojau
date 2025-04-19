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
      <div className="flex items-center">
        <NavLink to="/home">
          <img src={HostelKhojauLogo} alt="Hostel Khojau Logo" className="h-10" />
        </NavLink>
      </div>
      <div className="flex items-center space-x-6">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            isActive ? 'text-red-600 font-medium' : 'text-gray-600 hover:text-red-600'
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/hostel"
          className={({ isActive }) =>
            isActive ? 'text-red-600 font-medium' : 'text-gray-600 hover:text-red-600'
          }
        >
          Hostels
        </NavLink>
        {user && user.role === 'owner' && (
          <>
            <NavLink
              to="/register-hostel"
              className={({ isActive }) =>
                isActive ? 'text-red-600 font-medium' : 'text-gray-600 hover:text-red-600'
              }
            >
              Register Hostel
            </NavLink>
            <NavLink
              to="/owner/hostels"
              className={({ isActive }) =>
                isActive ? 'text-red-600 font-medium' : 'text-gray-600 hover:text-red-600'
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
              isActive ? 'text-red-600 font-medium' : 'text-gray-600 hover:text-red-600'
            }
          >
            Admin Dashboard
          </NavLink>
        )}
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Logout
          </button>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? 'text-red-600 font-medium' : 'text-gray-600 hover:text-red-600'
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
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