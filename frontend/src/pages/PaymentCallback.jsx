import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Navbar from '../components/Navbar';

const PaymentCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handlePaymentCallback = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login');
        setTimeout(() => navigate('/login'), 1000);
        return;
      }

      const params = new URLSearchParams(location.search);
      const pidx = params.get('pidx');
      const transaction_id = params.get('transaction_id');
      const status = params.get('status');
      const purchase_order_id = params.get('purchase_order_id');

      if (!pidx || !purchase_order_id) {
        toast.error('Invalid payment callback');
        setTimeout(() => navigate('/my-bookings'), 2000);
        return;
      }

      try {
        // For cancelled payments or failures, update the booking status
        if (status === 'Cancelled' || status === 'Failed') {
          await axios.post(
            `/api/bookings/${purchase_order_id}/cancel-payment`,
            {},
            {
              headers: { 'x-auth-token': token }
            }
          );
          toast.info(status === 'Cancelled' ? 'Payment was cancelled' : 'Payment failed');
          const bookingResponse = await axios.get(
            `/api/bookings/booking/${purchase_order_id}`,
            {
              headers: { 'x-auth-token': token }
            }
          );
          
          // Redirect back to the hostel details page if we have the hostel ID
          if (bookingResponse.data && bookingResponse.data.hostelId) {
            setTimeout(() => navigate(`/hostels/${bookingResponse.data.hostelId._id}?tab=rooms`), 2000);
          } else {
            setTimeout(() => navigate('/my-bookings'), 2000);
          }
          return;
        }

        // For successful payments, verify with backend
        const response = await axios.get(
          `/api/bookings/complete-khalti-payment?pidx=${pidx}&transaction_id=${transaction_id}&purchase_order_id=${purchase_order_id}`,
          {
            headers: { 'x-auth-token': token }
          }
        );
        
        const data = response.data;
        
        if (data.success) {
          toast.success('Payment successful!');
          try {
            const bookingResponse = await axios.get(
              `/api/bookings/booking/${purchase_order_id}`,
              {
                headers: { 'x-auth-token': token }
              }
            );
            
            if (bookingResponse.data && bookingResponse.data.hostelId) {
              // Redirect back to the hostel details page
              setTimeout(() => navigate(`/hostels/${bookingResponse.data.hostelId._id}?tab=rooms`), 2000);
              return;
            }
          } catch (error) {
            console.error('Error fetching booking details:', error);
            toast.error('Error loading booking details');
            setTimeout(() => navigate('/my-bookings'), 2000);
          }
        } else {
          toast.error(data.message || 'Payment verification failed');
          setTimeout(() => navigate('/my-bookings'), 2000);
        }
      } catch (error) {
        console.error('Payment callback error:', error.response?.data || error);
        toast.error(error.response?.data?.message || 'Payment processing failed');
        // Fallback redirect to my bookings
        setTimeout(() => navigate('/my-bookings'), 2000);
      } finally {
        setLoading(false);
      }
    };

    handlePaymentCallback();
  }, [navigate, location]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-col justify-center items-center gap-4 mt-20">
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            <p className="text-lg font-poppins text-gray-700">Processing payment...</p>
          </>
        ) : (
          <p className="text-lg font-poppins text-gray-700">Redirecting...</p>
        )}
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default PaymentCallback;