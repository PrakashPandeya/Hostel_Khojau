import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/bookings/my-bookings', {
          headers: { 'x-auth-token': token },
        });
        setBookings(response.data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  const calculateStayEndDate = (checkInDate, totalMonthsStaying) => {
    const checkIn = new Date(checkInDate);
    const endDate = new Date(checkIn);
    endDate.setMonth(checkIn.getMonth() + totalMonthsStaying);
    return endDate.toLocaleDateString();
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await axios.delete(`/api/bookings/${bookingId}`, {
        headers: { 'x-auth-token': token },
      });
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
      toast.success('Booking cancelled successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <p className="text-lg font-poppins">Loading your bookings...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6 font-poppins">My Bookings</h1>
        {bookings.length === 0 ? (
          <p className="text-gray-600 font-poppins">You have no bookings yet.</p>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200"
              >
                <h2 className="text-xl font-semibold font-poppins">
                  {booking.hostelId?.name || 'Unknown Hostel'}
                </h2>
                <div className="mt-2 space-y-1">
                  <p className="text-gray-700 font-poppins">
                    <span className="font-medium">Room:</span> {booking.roomId?.roomNumber} (
                    {booking.roomId?.roomType})
                  </p>
                  <p className="text-gray-700 font-poppins">
                    <span className="font-medium">Check-in Date:</span>{' '}
                    {new Date(booking.checkInDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 font-poppins">
                    <span className="font-medium">Total Months Staying:</span>{' '}
                    {booking.totalMonthsStaying}
                  </p>
                  <p className="text-gray-700 font-poppins">
                    <span className="font-medium">Stay Ends On:</span>{' '}
                    {calculateStayEndDate(booking.checkInDate, booking.totalMonthsStaying)}
                  </p>
                  <p className="text-gray-700 font-poppins">
                    <span className="font-medium">Total Price:</span> Rs.{' '}
                    {booking.totalPrice.toLocaleString()}
                  </p>
                  <p className="text-gray-700 font-poppins">
                    <span className="font-medium">Status:</span>{' '}
                    <span
                      className={
                        booking.status === 'confirmed'
                          ? 'text-green-500'
                          : booking.status === 'pending'
                          ? 'text-yellow-500'
                          : 'text-red-500'
                      }
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </p>
                </div>
                {booking.status !== 'cancelled' && (
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200 font-poppins"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default MyBookings;