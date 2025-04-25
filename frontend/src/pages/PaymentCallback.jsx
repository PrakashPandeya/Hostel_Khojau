import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PaymentCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handlePaymentCallback = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login');
        setTimeout(() => navigate('/login'), 1000);
        return;
      }

      const params = new URLSearchParams(location.search);
      const status = params.get('status');

      if (status === 'Completed') {
        toast.success('Payment verified successfully');
      } else {
        toast.error('Payment failed or was cancelled');
      }

      setTimeout(() => navigate('/my-bookings'), 1000);
    };

    handlePaymentCallback();
  }, [navigate, location]);

  return (
    <div className="min-h-screen bg-white flex justify-center items-center">
      <p className="text-lg">Processing payment...</p>
      <ToastContainer />
    </div>
  );
};

export default PaymentCallback;