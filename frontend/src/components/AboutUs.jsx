import React from 'react';
import { useNavigate } from 'react-router-dom';
import AboutUsImage from '../assets/AboutUsImage.jpg'; 

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="py-12">
      <div className="flex items-center gap-8 bg-gray-50 p-8 rounded-lg shadow-sm">
        <div className="w-1/2">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4 font-poppins">About Us</h2>
          <p className="text-gray-600 mb-6 text-lg font-poppins">
            Hostel Khojau is your go-to platform for finding the best hostels in Kathmandu and beyond. 
            We connect students and hostel owners together with one another. 
            Our mission is to make hostel searching easy, reliable, and hassle-free.
          </p>
          
        </div>
        <div className="w-1/2">
          <img
            src={AboutUsImage}
            alt="About Hostel Khojau"
            className="w-full h-80 object-cover rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;