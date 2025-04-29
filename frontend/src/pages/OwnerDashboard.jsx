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
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newRoom, setNewRoom] = useState({
        hostelId: '',
        roomNumber: '',
        roomType: '',
        monthlyPrice: ''
    });
    const [chatReplies, setChatReplies] = useState({});

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
                const [hostelsResponse, bookingsResponse, chatsResponse] = await Promise.all([
                    axios.get('http://localhost:5000/api/owner/hostels', {
                        headers: { 'x-auth-token': token }
                    }),
                    axios.get('http://localhost:5000/api/owner/bookings', {
                        headers: { 'x-auth-token': token }
                    }),
                    axios.get('/api/chats', {
                        headers: { 'x-auth-token': token }
                    })
                ]);
                setHostels(hostelsResponse.data);
                setBookings(bookingsResponse.data);
                setChats(chatsResponse.data);
            } catch (err) {
                if (err.response?.status === 403 && err.response?.data?.message === 'Account pending approval') {
                    toast.error('Your account is still pending approval. Please wait for admin approval.');
                    setTimeout(() => navigate('/pending-approval'), 1000);
                } else if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    toast.error('Session expired, please login again');
                    setTimeout(() => navigate('/login'), 1000);
                } else {
                    toast.error(err.response?.data?.message || 'Failed to fetch data');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000); // Poll every 30 seconds
        return () => clearInterval(interval);
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
            setNewRoom({ hostelId: '', roomNumber: '', roomType: '', monthlyPrice: '' });
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

    const handleDeleteReview = async (hostelId, reviewId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.delete(`/api/reviews/${hostelId}/reviews/${reviewId}`, {
                headers: { 'x-auth-token': token },
            });
            setHostels((prevHostels) =>
                prevHostels.map((hostel) =>
                    hostel._id === hostelId ? response.data : hostel
                )
            );
            toast.success('Review deleted successfully');
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                toast.error('Session expired, please login again');
                setTimeout(() => navigate('/login'), 1000);
            } else {
                toast.error(err.response?.data?.message || 'Failed to delete review');
            }
        }
    };

    const handleReplyChange = (chatId, value) => {
        setChatReplies(prev => ({ ...prev, [chatId]: value }));
    };

    const handleSendReply = async (chatId) => {
        const token = localStorage.getItem('token');
        const message = chatReplies[chatId]?.trim();
        if (!message) {
            toast.error('Reply cannot be empty');
            return;
        }

        try {
            const response = await axios.post(
                `/api/chats/${chatId}/message`,
                { message },
                { headers: { 'x-auth-token': token } }
            );
            setChats(chats.map(c => c._id === chatId ? response.data : c));
            setChatReplies(prev => ({ ...prev, [chatId]: '' }));
            toast.success('Reply sent');
        } catch (err) {
            if (err.response?.status === 403 && err.response?.data?.message === 'Account pending approval') {
                toast.error('Your account is pending approval. You cannot reply until approved.');
            } else {
                toast.error(err.response?.data?.message || 'Failed to send reply');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Owner Dashboard</h1>

                {/* Hostels Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-6">Your Hostels</h2>
                    {hostels.length === 0 ? (
                        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                            <p className="text-gray-500 text-lg">No hostels registered yet.</p>
                            <button
                                onClick={() => navigate('/register-hostel')}
                                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Register a Hostel
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {hostels.map(hostel => (
                                <div
                                    key={hostel._id}
                                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
                                >
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{hostel.name}</h3>
                                    <p className="text-gray-600 mb-2">
                                        Status: <span className={
                                            hostel.status === 'active' ? 'text-green-500' :
                                            hostel.status === 'pending' ? 'text-yellow-500' :
                                            'text-red-500'
                                        }>
                                            {hostel.status.charAt(0).toUpperCase() + hostel.status.slice(1)}
                                        </span>
                                    </p>
                                    <p className="text-gray-600 mb-4">Rooms: {hostel.rooms.length}</p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => navigate(`/hostels/${hostel._id}`)}
                                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDeleteHostel(hostel._id)}
                                            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Chats Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-6">Messages</h2>
                    {chats.length === 0 ? (
                        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                            <p className="text-gray-500 text-lg">No messages yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {chats.map(chat => (
                                <div
                                    key={chat._id}
                                    className="bg-white p-6 rounded-xl shadow-md"
                                >
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                        {chat.hostel.name} - Chat with {chat.user.name}
                                    </h3>
                                    <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 mb-4">
                                        {chat.messages.map((msg, index) => (
                                            <div
                                                key={index}
                                                className={`mb-2 flex ${
                                                    msg.sender._id === chat.owner._id ? 'justify-end' : 'justify-start'
                                                }`}
                                            >
                                                <div
                                                    className={`max-w-xs rounded-lg p-3 ${
                                                        msg.sender._id === chat.owner._id
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-gray-200 text-gray-800'
                                                    }`}
                                                >
                                                    <p className="text-sm">{msg.content}</p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {new Date(msg.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <textarea
                                            value={chatReplies[chat._id] || ''}
                                            onChange={(e) => handleReplyChange(chat._id, e.target.value)}
                                            className="flex-1 px-4 py-2 border rounded-lg resize-none"
                                            rows="3"
                                            placeholder="Type your reply..."
                                        />
                                        <button
                                            onClick={() => handleSendReply(chat._id)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                                        >
                                            Send
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Reviews Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-6">Reviews</h2>
                    {hostels.length === 0 ? (
                        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                            <p className="text-gray-500 text-lg">No hostels, so no reviews yet.</p>
                        </div>
                    ) : hostels.every(hostel => !hostel.reviews || hostel.reviews.length === 0) ? (
                        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                            <p className="text-gray-500 text-lg">No reviews yet for your hostels.</p>
                        </div>
                    ) : (
                        hostels.map(hostel => (
                            <div key={hostel._id} className="mb-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">{hostel.name}</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {hostel.reviews.map(review => (
                                        <div
                                            key={review._id}
                                            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition flex justify-between items-start"
                                        >
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {review.userId?.name || 'Anonymous'} - {review.rating} ★
                                                </p>
                                                <p className="text-gray-600 mt-1">{review.comment}</p>
                                                <p className="text-gray-500 text-sm mt-2">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteReview(hostel._id, review._id)}
                                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </section>

                {/* Add Room Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-6">Add New Room</h2>
                    <div className="bg-white p-8 rounded-xl shadow-md">
                        <form onSubmit={handleAddRoom} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Hostel</label>
                                <select
                                    name="hostelId"
                                    value={newRoom.hostelId}
                                    onChange={handleRoomChange}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required
                                >
                                    <option value="">Select Hostel</option>
                                    {hostels.map(hostel => (
                                        <option key={hostel._id} value={hostel._id}>{hostel.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
                                <input
                                    type="text"
                                    name="roomNumber"
                                    value={newRoom.roomNumber}
                                    onChange={handleRoomChange}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                                <select
                                    name="roomType"
                                    value={newRoom.roomType}
                                    onChange={handleRoomChange}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price (Rs./month)</label>
                                <input
                                    type="number"
                                    name="monthlyPrice"
                                    value={newRoom.monthlyPrice}
                                    onChange={handleRoomChange}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                                >
                                    Add Room
                                </button>
                            </div>
                        </form>
                    </div>
                </section>

                {/* Bookings Section */}
                <section>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-6">Bookings</h2>
                    {bookings.length === 0 ? (
                        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                            <p className="text-gray-500 text-lg">No bookings yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {bookings.map(booking => (
                                <div
                                    key={booking._id}
                                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
                                >
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{booking.hostel.name}</h3>
                                    <p className="text-gray-600">Room: {booking.room.roomNumber} ({booking.room.roomType})</p>
                                    <p className="text-gray-600">User: {booking.user.name}</p>
                                    <p className="text-gray-600">Check-in: {new Date(booking.checkInDate).toLocaleDateString()}</p>
                                    <p className="text-gray-600">Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                                    <p className="text-gray-600">Amount: Rs. {booking.totalAmount}</p>
                                    <p className="text-gray-600">
                                        Status: <span className={booking.status === 'Confirmed' ? 'text-green-500' : 'text-yellow-500'}>{booking.status}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
            <Footer />
            <ToastContainer />
        </div>
    );
};

export default OwnerDashboard;