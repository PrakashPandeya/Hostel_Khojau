import React from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterHostel = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-blue-50 rounded-lg p-8 mb-12 text-center">
      <h2 className="text-2xl font-bold mb-2">Register a Hostel for Free?</h2>
      <p className="text-gray-600 mb-6 text-lg">
        "Get your Hostel Online at our website by registering Here for Free!"
      </p>
      <button
        onClick={() => navigate('/register-hostel')}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-full transition-colors"
      >
        Register Here
      </button>
    </div>
  );
};

export default RegisterHostel;