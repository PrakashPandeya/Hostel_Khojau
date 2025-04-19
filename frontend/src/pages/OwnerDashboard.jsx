import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [hostels, setHostels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRoom, setNewRoom] = useState({
    hostelId: '',
    roomNumber: '',
    roomType: '',
    price: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login');
        setTimeout(() => navigate('/login'), 1000);
        return;
      }

      try {
        setLoading(true);
        const [hostelsResponse, bookingsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/owner/hostels', {
            headers: { 'x-auth-token': token }
          }),
          axios.get('http://localhost:5000/api/owner/bookings', {
            headers: { 'x-auth-token': token }
          })
        ]);
        setHostels(hostelsResponse.data);
        setBookings(bookingsResponse.data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleRoomChange = (e) => {
    const { name, value } = e.target;
    setNewRoom(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        `http://localhost:5000/api/owner/hostels/${newRoom.hostelId}/rooms`,
        newRoom,
        { headers: { 'x-auth-token': token } }
      );
      toast.success('Room added successfully');
      setNewRoom({ hostelId: '', roomNumber: '', roomType: '', price: '' });
      // Refresh hostels
      const response = await axios.get('http://localhost:5000/api/owner/hostels', {
        headers: { 'x-auth-token': token }
      });
      setHostels(response.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add room');
    }
  };

  const handleDeleteHostel = async (hostelId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/hostels/${hostelId}`, {
        headers: { 'x-auth-token': token }
      });
      toast.success('Hostel deleted successfully');
      setHostels(hostels.filter(h => h._id !== hostelId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete hostel');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Owner Dashboard</h1>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Hostels</h2>
          {hostels.length === 0 ? (
            <p className="text-gray-600">No hostels registered yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hostels.map(hostel => (
                <div key={hostel._id} className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="font-bold text-lg mb-2">{hostel.name}</h3>
                  <p className="text-gray-600 mb-2">Status: {hostel.status}</p>
                  <p className="text-gray-600 mb-2">Rooms: {hostel.rooms.length}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/hostels/${hostel._id}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteHostel(hostel._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Add Room</h2>
          <form onSubmit={handleAddRoom} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Select Hostel</label>
              <select
                name="hostelId"
                value={newRoom.hostelId}
                onChange={handleRoomChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              >
                <option value="">Select Hostel</option>
                {hostels.map(hostel => (
                  <option key={hostel._id} value={hostel._id}>{hostel.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Room Number</label>
              <input
                type="text"
                name="roomNumber"
                value={newRoom.roomNumber}
                onChange={handleRoomChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Room Type</label>
              <select
                name="roomType"
                value={newRoom.roomType}
                onChange={handleRoomChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              >
                <option value="">Select Type</option>
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Triple">Triple</option>
                <option value="Dorm">Dorm</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price (Rs./night)</label>
              <input
                type="number"
                name="price"
                value={newRoom.price}
                onChange={handleRoomChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Add Room
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Bookings</h2>
          {bookings.length === 0 ? (
            <p className="text-gray-600">No bookings yet.</p>
          ) : (
            <div className="space-y-4">
              {bookings.map(booking => (
                <div key={booking._id} className="bg-white rounded-lg shadow-md p-4">
                  <p className="text-gray-600">Hostel: {booking.hostel.name}</p>
                  <p className="text-gray-600">Room: {booking.room.roomNumber} ({booking.room.roomType})</p>
                  <p className="text-gray-600">User: {booking.user.name}</p>
                  <p className="text-gray-600">Check-in: {new Date(booking.checkInDate).toLocaleDateString()}</p>
                  <p className="text-gray-600">Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                  <p className="text-gray-600">Amount: Rs. {booking.totalAmount}</p>
                  <p className="text-gray-600">Status: {booking.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default OwnerDashboard;