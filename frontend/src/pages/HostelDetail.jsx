import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HostelDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hostel, setHostel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('details');
    const [show360, setShow360] = useState(false);
    const [showBooking, setShowBooking] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [imageTimestamp, setImageTimestamp] = useState(Date.now());
    const [bookingForm, setBookingForm] = useState({
        roomId: '',
        checkInDate: '',
        totalMonthsStaying: 1,
    });
    const [chatForm, setChatForm] = useState({ message: '' });
    const [chat, setChat] = useState(null);
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const [reviewForm, setReviewForm] = useState({
        comment: '',
        rating: 0,
    });

    useEffect(() => {
        const fetchHostelDetails = async () => {
            try {
                setLoading(true);
                const [hostelResponse, roomsResponse] = await Promise.all([
                    axios.get(`/api/hostels/${id}`),
                    axios.get(`/api/hostels/${id}/rooms`),
                ]);

                // Add timestamp to force image reload
                const hostelData = hostelResponse.data;
                
                // Update image URLs with cache busting
                if (hostelData.images) {
                    hostelData.images = hostelData.images.map(img => {
                        // Handle both relative and absolute URLs
                        const baseUrl = img.startsWith('http') ? '' : 'http://localhost:5000';
                        const fullUrl = `${baseUrl}${img}`;
                        const separator = fullUrl.includes('?') ? '&' : '?';
                        return `${fullUrl}${separator}t=${imageTimestamp}`;
                    });
                }
                if (hostelData.images360) {
                    hostelData.images360 = hostelData.images360.map(img => {
                        const baseUrl = img.startsWith('http') ? '' : 'http://localhost:5000';
                        const fullUrl = `${baseUrl}${img}`;
                        const separator = fullUrl.includes('?') ? '&' : '?';
                        return `${fullUrl}${separator}t=${imageTimestamp}`;
                    });
                }

                setHostel(hostelData);
                setRooms(roomsResponse.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHostelDetails();
    }, [id, imageTimestamp]); 

    useEffect(() => {
        if (showChat && token && userId) {
            const fetchChat = async () => {
                try {
                    const response = await axios.get('/api/chats', {
                        headers: { 'x-auth-token': token }
                    });
                    const userChat = response.data.find(
                        (c) => c.hostel._id === id && c.user._id === userId
                    );
                    setChat(userChat || null);
                } catch (err) {
                    console.error('Error fetching chat:', err);
                    toast.error('Failed to load chat messages');
                }
            };

            fetchChat();
            const interval = setInterval(fetchChat, 60000);
            return () => clearInterval(interval);
        } else {
            setChat(null);
        }
    }, [showChat, token, userId, id]);

    useEffect(() => {
        const handleImagesUpdated = (event) => {
            if (event.detail.hostelId === id) {
                setImageTimestamp(Date.now()); // Force image refresh
            }
        };

        window.addEventListener('hostelImagesUpdated', handleImagesUpdated);
        return () => {
            window.removeEventListener('hostelImagesUpdated', handleImagesUpdated);
        };
    }, [id]);

    const handleBookingChange = (e) => {
        const { name, value } = e.target;
        setBookingForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleBookNow = async () => {
        if (!token) {
            const redirectUrl = `/hostels/${id}?tab=rooms`;
            toast.error('Please login to book');
            setTimeout(() => navigate(`/login?redirect=${encodeURIComponent(redirectUrl)}`), 1000);
            return;
        }

        const { roomId, checkInDate, totalMonthsStaying } = bookingForm;
        if (!roomId || !checkInDate || !totalMonthsStaying) {
            toast.error('Please fill in all booking details');
            return;
        }

        const checkIn = new Date(checkInDate);
        if (isNaN(checkIn.getTime())) {
            toast.error('Please select a valid check-in date');
            return;
        }

        const months = parseInt(totalMonthsStaying, 10);
        if (isNaN(months) || months < 1) {
            toast.error('Total months staying must be at least 1');
            return;
        }

        try {            const response = await api.post(
                `/bookings/${id}/book`,
                { roomId, checkInDate, totalMonthsStaying: months },
                { headers: { 'x-auth-token': token } }
            );

            if (response.data.success && response.data.payment?.payment_url) {
                window.location.href = response.data.payment.payment_url;
            } else {
                toast.error('Payment initiation failed: No payment URL received');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Booking failed';
            const errorDetails = err.response?.data?.error ? JSON.stringify(err.response.data.error) : '';
            console.error('Booking Error:', err.response?.data || err.message);
            toast.error(`${errorMessage}${errorDetails ? ` - ${errorDetails}` : ''}`);
        }
    };

    const handleSelectRoom = (roomId) => {
        if (!token) {
            const redirectUrl = `/hostels/${id}?tab=rooms`;
            toast.error('Please login to book');
            setTimeout(() => navigate(`/login?redirect=${encodeURIComponent(redirectUrl)}`), 1000);
            return;
        }
        setBookingForm({ roomId, checkInDate: '', totalMonthsStaying: 1 });
        setShowBooking(true);
    };

    const handleChatChange = (e) => {
        const { name, value } = e.target;
        setChatForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSendMessage = async () => {
        if (!token) {
            const redirectUrl = `/hostels/${id}?tab=details`;
            toast.error('Please login to contact the owner');
            setTimeout(() => navigate(`/login?redirect=${encodeURIComponent(redirectUrl)}`), 1000);
            return;
        }

        if (!chatForm.message.trim()) {
            toast.error('Message cannot be empty');
            return;
        }

        try {
            const response = await axios.post(
                '/api/chats',
                { hostelId: id, message: chatForm.message },
                { headers: { 'x-auth-token': token } }
            );
            setChat(response.data);
            setChatForm({ message: '' });
            toast.success('Message sent');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send message');
        }
    };

    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setReviewForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleRatingChange = (rating) => {
        setReviewForm((prev) => ({ ...prev, rating }));
    };

    const handleReviewSubmit = async () => {
        if (!token) {
            const redirectUrl = `/hostels/${id}?tab=reviews`;
            toast.error('Please login to submit a review');
            setTimeout(() => navigate(`/login?redirect=${encodeURIComponent(redirectUrl)}`), 1000);
            return;
        }

        if (!reviewForm.comment || reviewForm.rating === 0) {
            toast.error('Please provide both a comment and a rating');
            return;
        }

        try {
            const response = await axios.post(
                `/api/reviews/${id}/reviews`,
                { comment: reviewForm.comment, rating: reviewForm.rating },
                { headers: { 'x-auth-token': token } }
            );
            setHostel(response.data);
            setReviewForm({ comment: '', rating: 0 });
            toast.success('Review submitted successfully');
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                toast.error('Session expired, please login again');
                setTimeout(() => navigate(`/login?redirect=${encodeURIComponent(`/hostels/${id}?tab=reviews`)}`), 1000);
            } else {
                toast.error(err.response?.data?.message || 'Failed to submit review');
            }
        }
    };

    if (loading) return <LoadingState />;
    if (error) return <ErrorState error={error} />;
    if (!hostel) return <NotFoundState />;

    const totalReviews = hostel.reviews?.length || 0;
    const averageRating =
        hostel.reviews?.length > 0
            ? (hostel.reviews.reduce((sum, review) => sum + review.rating, 0) / hostel.reviews.length).toFixed(1)
            : 0;

    const mapSrc = hostel.mapEmbedUrl?.match(/src="([^"]+)"/)?.[1] || '';

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 font-poppins">{hostel.name}</h1>
                    <p className="text-gray-600 font-poppins">
                        {hostel.location}, {hostel.city}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-4">
                        {hostel.contact?.phone && (
                            <div className="bg-gray-100 px-4 py-2 rounded-lg">
                                <span className="font-medium font-poppins">Phone:</span> {hostel.contact.phone}
                            </div>
                        )}
                        <div className="bg-gray-100 px-4 py-2 rounded-lg">
                            <span className="font-medium font-poppins">Type:</span> {hostel.hostelType}
                        </div>
                        {hostel.contact?.email && (
                            <div className="bg-gray-100 px-4 py-2 rounded-lg">
                                <span className="font-medium font-poppins">Email:</span> {hostel.contact.email}
                            </div>
                        )}
                        {(hostel.owner?.name || hostel.ownername) && (
                            <div className="bg-gray-100 px-4 py-2 rounded-lg">
                                <span className="font-medium font-poppins">Owner:</span> {hostel.owner?.name || hostel.ownername}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold font-poppins">Gallery</h2>
                        {hostel.images360?.length > 0 && (
                            <button
                                onClick={() => setShow360(!show360)}
                                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200 font-poppins"
                            >
                                {show360 ? (
                                    <>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Show Photos
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Show 360° View
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    {show360 ? (
                        hostel.images360?.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6">
                                {hostel.images360.map((url, index) => (
                                    <div
                                        key={`360-${index}-${imageTimestamp}`}
                                        className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg"
                                    >
                                        <iframe
                                            src={`${url}?logo=0&info=0&fs=1&vr=0&thumbs=1`}
                                            className="absolute inset-0 w-full h-full"
                                            allow="xr-spatial-tracking; gyroscope; accelerometer; fullscreen"
                                            allowFullScreen
                                            loading="lazy"
                                            title={`360° View of ${hostel.name} - ${index + 1}`}
                                            key={`${url}-${imageTimestamp}`}
                                            onError={(e) => {
                                                const container = e.target.parentElement;
                                                container.innerHTML = '<div class="flex items-center justify-center h-full bg-gray-100"><p class="text-gray-500">360° View not available</p></div>';
                                            }}
                                        />
                                        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-poppins">
                                            360° View
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-100 rounded-lg p-8 text-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-12 w-12 mx-auto text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                <p className="mt-2 text-gray-500 font-poppins">No 360° images available</p>
                            </div>
                        )
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {hostel.images?.length > 0 ? (
                                hostel.images.map((img, index) => (
                                    <div
                                        key={`img-${index}-${imageTimestamp}`}
                                        className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                                    >
                                        <img
                                            src={img}
                                            alt={`${hostel.name} - Photo ${index + 1}`}
                                            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                                            loading="lazy"
                                            key={`${img}-${imageTimestamp}`}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                            <span className="text-white font-medium font-poppins">Photo {index + 1}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full bg-gray-100 rounded-lg p-8 text-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-12 w-12 mx-auto text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                <p className="mt-2 text-gray-500 font-poppins">No photos available</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <StatCard title="Rating" value={averageRating} icon="⭐" />
                <StatCard
                    title="Price Range"
                    value={`Rs. ${hostel.priceRange.min} - Rs. ${hostel.priceRange.max}`}
                    icon="💰"
                />
                <StatCard title="Reviews" value={totalReviews} icon="✍️" />
            </div>

            <div className="mb-6">
                <div className="flex flex-wrap gap-3 sm:gap-4">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`flex items-center gap-2 py-3 px-6 rounded-lg border border-gray-200 font-medium text-base font-poppins text-gray-700 ${
                            activeTab === 'details' ? 'border-b-2 border-gray-700' : ''
                        }`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        Hostel Details
                    </button>
                    <button
                        onClick={() => setActiveTab('amenities')}
                        className={`flex items-center gap-2 py-3 px-6 rounded-lg border border-gray-200 font-medium text-base font-poppins text-gray-700 ${
                            activeTab === 'amenities' ? 'border-b-2 border-gray-700' : ''
                        }`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        Hostel Features
                    </button>
                    <button
                        onClick={() => setActiveTab('rooms')}
                        className={`flex items-center gap-2 py-3 px-6 rounded-lg border border-gray-200 font-medium text-base font-poppins text-gray-700 ${
                            activeTab === 'rooms' ? 'border-b-2 border-gray-700' : ''
                        }`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                        </svg>
                        Rooms
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`flex items-center gap-2 py-3 px-6 rounded-lg border border-gray-200 font-medium text-base font-poppins text-gray-700 ${
                            activeTab === 'reviews' ? 'border-b-2 border-gray-700' : ''
                        }`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"
                            />
                        </svg>
                        Reviews
                    </button>
                </div>
            </div>

            <div className="mb-8">
                {activeTab === 'details' && (
                    <div>
                        <p className="text-gray-700 mb-6 font-poppins">{hostel.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DetailCard title="Hostel Type" value={hostel.hostelType} />
                            <DetailCard
                                title="Price Range"
                                value={`Rs. ${hostel.priceRange.min} - Rs. ${hostel.priceRange.max}`}
                            />
                            <DetailCard title="Location" value={`${hostel.location}, ${hostel.city}`} />
                            {hostel.contact?.phone && <DetailCard title="Contact" value={hostel.contact.phone} />}
                        </div>
                        {mapSrc && (
                            <div className="mt-8">
                                <h2 className="text-xl font-bold mb-4 font-poppins">Location</h2>
                                <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg border border-gray-200">
                                    <iframe
                                        src={mapSrc}
                                        className="w-full h-full"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Hostel Location Map"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'amenities' && (
                    <div>
                        <h3 className="text-lg font-medium mb-4 font-poppins">Hostel Features</h3>
                        {hostel.amenities && hostel.amenities.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {hostel.amenities.map((amenity, index) => (
                                    <div key={index} className="flex items-center bg-gray-50 p-3 rounded-lg">
                                        <span className="mr-2 text-green-500">✔</span>
                                        <span className="text-gray-700 font-poppins">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 font-poppins">No amenities listed.</p>
                        )}
                    </div>
                )}

                {activeTab === 'rooms' && (
                    <div>
                        <h3 className="text-lg font-medium mb-4 font-poppins">Available Rooms</h3>
                        {rooms.filter(room => room.isAvailable).length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {rooms
                                    .filter(room => room.isAvailable)
                                    .map((room) => (
                                        <div
                                            key={room._id}
                                            className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                        >
                                            <div className="relative h-48">
                                                <img
                                                    src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
                                                    alt={`Room ${room.roomNumber}`}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-poppins">
                                                    Available
                                                </div>
                                            </div>
                                            <div className="p-5">
                                                <h4 className="text-xl font-semibold text-gray-800 mb-2 font-poppins">
                                                    Room {room.roomNumber}
                                                </h4>
                                                <div className="space-y-2">
                                                    <p className="text-gray-600 font-poppins">
                                                        <span className="font-medium">Type:</span> {room.roomType}
                                                    </p>
                                                    <p className="text-gray-600 font-poppins">
                                                        <span className="font-medium">Price:</span> Rs. {room.monthlyPrice.toLocaleString()}/month
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleSelectRoom(room._id)}
                                                    className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors duration-200 font-poppins"
                                                >
                                                    Book Now
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <div className="bg-gray-100 rounded-lg p-8 text-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-12 w-12 mx-auto text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                    />
                                </svg>
                                <p className="mt-2 text-gray-500 font-poppins">No rooms are currently available.</p>
                                <p className="mt-1 text-gray-400 font-poppins">Please check back later or contact the owner.</p>
                            </div>
                        )}
                        {showBooking && (
                            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mt-6">
                                <h2 className="text-xl font-bold mb-4 font-poppins">Book Your Stay</h2>
                                {rooms.filter(room => room.isAvailable).length === 0 ? (
                                    <p className="text-gray-600 font-poppins">No rooms available at the moment.</p>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1 font-poppins">Select Room</label>
                                            <select
                                                name="roomId"
                                                value={bookingForm.roomId}
                                                onChange={handleBookingChange}
                                                className="w-full px-4 py-2 border rounded-lg"
                                            >
                                                <option value="">Select a room</option>
                                                {rooms
                                                    .filter(room => room.isAvailable)
                                                    .map((room) => (
                                                        <option key={room._id} value={room._id}>
                                                            Room {room.roomNumber} ({room.roomType}) - Rs. {room.monthlyPrice}/month
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 font-poppins">Check-in Date</label>
                                            <input
                                                type="date"
                                                name="checkInDate"
                                                value={bookingForm.checkInDate}
                                                onChange={handleBookingChange}
                                                className="w-full px-4 py-2 border rounded-lg"
                                                min={new Date().toISOString().split('T')[0]}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 font-poppins">Total Months Staying</label>
                                            <input
                                                type="number"
                                                name="totalMonthsStaying"
                                                value={bookingForm.totalMonthsStaying}
                                                onChange={handleBookingChange}
                                                className="w-full px-4 py-2 border rounded-lg"
                                                min="1"
                                                step="1"
                                                required
                                            />
                                        </div>
                                        <button
                                            onClick={handleBookNow}
                                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors font-poppins"
                                        >
                                            Confirm Booking
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div>
                        <h3 className="text-lg font-medium mb-4 font-poppins">Reviews</h3>
                        {hostel.reviews && hostel.reviews.length > 0 ? (
                            <div className="space-y-6 mb-8">
                                {hostel.reviews.map((review, index) => (
                                    <ReviewCard key={index} review={review} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 mb-8 font-poppins">No reviews yet.</p>
                        )}

                        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                            <h4 className="text-lg font-medium mb-4 font-poppins">Write a Review</h4>
                            {token ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 font-poppins">Your Rating</label>
                                        <div className="flex items-center space-x-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => handleRatingChange(star)}
                                                    className={`text-2xl ${
                                                        star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'
                                                    } focus:outline-none`}
                                                >
                                                    ★
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 font-poppins">Your Review</label>
                                        <textarea
                                            name="comment"
                                            value={reviewForm.comment}
                                            onChange={handleReviewChange}
                                            className="w-full px-4 py-2 border rounded-lg resize-y"
                                            rows="4"
                                            placeholder="Write your review here..."
                                        />
                                    </div>
                                    <button
                                        onClick={handleReviewSubmit}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors font-poppins"
                                    >
                                        Submit Review
                                    </button>
                                </div>
                            ) : (
                                <p className="text-gray-600 font-poppins">
                                    Please{' '}
                                    <button
                                        onClick={() => {
                                            const redirectUrl = `/hostels/${id}?tab=reviews`;
                                            navigate(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
                                        }}
                                        className="text-blue-500 hover:underline"
                                    >
                                        login
                                    </button>{' '}
                                    to write a review.
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
                {activeTab !== 'rooms' && (
                    <button
                        onClick={() => setShowChat(!showChat)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition duration-200 font-poppins"
                    >
                        {showChat ? 'Hide Chat' : 'Message Owner'}
                    </button>
                )}
            </div>

            {showChat && (
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
                    <h2 className="text-xl font-bold mb-4 font-poppins">Message Owner</h2>
                    {chat ? (
                        <div className="space-y-4">
                            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
                                {chat.messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`mb-2 flex ${
                                            msg.sender._id === userId ? 'justify-end' : 'justify-start'
                                        }`}
                                    >
                                        <div
                                            className={`max-w-xs rounded-lg p-3 ${
                                                msg.sender._id === userId
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-200 text-gray-800'
                                            }`}
                                        >                            <p className="text-xs font-bold mb-1 font-poppins">
                                {msg.sender._id === userId ? 'You' : 'Message Owner'}
                            </p>
                                            <p className="text-sm font-poppins">{msg.content}</p>
                                            <p className="text-xs text-gray-400 mt-1 font-poppins">
                                                {new Date(msg.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <textarea
                                    name="message"
                                    value={chatForm.message}
                                    onChange={handleChatChange}
                                    className="flex-1 px-4 py-2 border rounded-lg resize-none font-poppins"
                                    rows="3"
                                    placeholder="Type your message..."
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors font-poppins"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-gray-600 font-poppins">No messages yet. Start the conversation!</p>
                            <div className="flex gap-2">
                                <textarea
                                    name="message"
                                    value={chatForm.message}
                                    onChange={handleChatChange}
                                    className="flex-1 px-4 py-2 border rounded-lg resize-none font-poppins"
                                    rows="3"
                                    placeholder="Type your message..."
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-poppins"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </main>
        <Footer />
        <ToastContainer />
    </div>
);
};

const LoadingState = () => (
    <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center h-64">
            <p className="text-lg font-poppins">Loading hostel details...</p>
        </div>
        <Footer />
    </div>
);

const ErrorState = ({ error }) => (
    <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center h-64">
            <p className="text-lg text-red-500 font-poppins">Error: {error}</p>
        </div>
        <Footer />
    </div>
);

const NotFoundState = () => (
    <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center h-64">
            <p className="text-lg font-poppins">Hostel not found</p>
        </div>
        <Footer />
    </div>
);

const StatCard = ({ title, value, icon }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow duration-300">
        <div className="text-2xl mb-1">{icon}</div>
        <h3 className="font-bold text-lg font-poppins">{value}</h3>
        <p className="text-gray-600 text-sm font-poppins">{title}</p>
    </div>
);

const DetailCard = ({ title, value }) => (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300">
        <h3 className="font-medium text-gray-700 font-poppins">{title}</h3>
        <p className="text-gray-900 font-poppins">{value}</p>
    </div>
);

const ReviewCard = ({ review }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center">
                <span className="text-gray-600">👤</span>
            </div>
            <div>
                <h4 className="font-medium font-poppins">{review.userId?.name || 'Anonymous'}</h4>
                <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                            ★
                        </span>
                    ))}
                </div>
            </div>
        </div>
        <p className="text-gray-700 font-poppins">{review.comment}</p>
        <p className="text-gray-500 text-sm mt-2 font-poppins">{new Date(review.createdAt).toLocaleDateString()}</p>
    </div>
);

export default HostelDetails;