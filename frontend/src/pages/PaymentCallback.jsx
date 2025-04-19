import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PaymentCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyPayment = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login');
        setTimeout(() => navigate('/login'), 1000);
        return;
      }

      const params = new URLSearchParams(location.search);
      const paymentId = params.get('pidx');
      const status = params.get('status') === 'Completed' ? 'Completed' : 'Failed';

      try {
        await axios.post(
          'http://localhost:5000/api/bookings/payment/verify',
          { payment_id: paymentId, status },
          { headers: { 'x-auth-token': token } }
        );
        toast.success('Payment verified successfully');
        setTimeout(() => navigate('/home'), 1000);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Payment verification failed');
        setTimeout(() => navigate('/home'), 1000);
      }
    };

    verifyPayment();
  }, [navigate, location]);

  return (
    <div className="min-h-screen bg-white flex justify-center items-center">
      <p className="text-lg">Processing payment...</p>
      <ToastContainer />
    </div>
  );
};

export default PaymentCallback;