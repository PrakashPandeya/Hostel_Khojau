// Footer.jsx
import React from 'react';
import HostelKhojauLogo from '../assets/HostelKhojauLogo.png'; // Ensure this path is correct

const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-8">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="grid grid-cols-3 gap-12">
          <div className="space-y-6">
            <div className="flex items-center">
              {/* Replace with placeholder if image not loading */}
              {HostelKhojauLogo ? (
                <img src={HostelKhojauLogo} alt="Logo" className="h-10 w-10" />
              ) : (
                <div className="h-10 w-10 bg-gray-300 flex items-center justify-center rounded">
                  <span>Logo</span>
                </div>
              )}
              <span className="ml-3 text-lg">Hostel Khojau</span>
            </div>
            <div className="flex space-x-6">
              {/* Social media icons would go here */}
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
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full px-4 py-2 bg-gray-200 rounded-lg focus:outline-none" 
              />
              <button className="absolute right-2 top-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-gray-500"
                >
                  <path d="M22 2L11 13"></path>
                  <path d="M22 2L15 22 11 13 2 9l20-7z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;