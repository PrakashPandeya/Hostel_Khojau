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
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <p className="text-lg font-poppins text-gray-700">Loading your bookings...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8 font-poppins text-gray-800">My Bookings</h1>
        {bookings.length === 0 ? (
          <p className="text-gray-600 font-poppins text-lg">You have no bookings yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
              >
                <h2 className="text-xl font-semibold font-poppins text-gray-800 mb-3">
                  {booking.hostelId?.name || 'Unknown Hostel'}
                </h2>
                <div className="space-y-2 text-gray-600 font-poppins">
                  <p>
                    <span className="font-medium text-gray-700">Room:</span> {booking.roomId?.roomNumber} (
                    {booking.roomId?.roomType})
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Check-in Date:</span>{' '}
                    {new Date(booking.checkInDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Total Months Staying:</span>{' '}
                    {booking.totalMonthsStaying}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Stay Ends On:</span>{' '}
                    {calculateStayEndDate(booking.checkInDate, booking.totalMonthsStaying)}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Total Price:</span> Rs.{' '}
                    {booking.totalPrice.toLocaleString()}
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium text-gray-700">Status:</span>{' '}
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-sm font-medium ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </p>
                </div>
                {booking.status !== 'cancelled' && (
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200 font-poppins text-sm font-medium"
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
      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default MyBookings;