import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  const [bookingForm, setBookingForm] = useState({
    roomId: '',
    checkInDate: '',
    checkOutDate: '',
  });

  useEffect(() => {
    const fetchHostelDetails = async () => {
      try {
        setLoading(true);
        const [hostelResponse, roomsResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/hostels/${id}`),
          axios.get(`http://localhost:5000/api/hostels/${id}/rooms`),
        ]);
        console.log('Hostel details:', hostelResponse.data); // Debug log
        setHostel(hostelResponse.data);
        setRooms(roomsResponse.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHostelDetails();
  }, [id]);

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookNow = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to book');
      setTimeout(() => navigate('/login'), 1000);
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/bookings/${id}/book`,
        bookingForm,
        {
          headers: { 'x-auth-token': token },
        }
      );
      window.location.href = response.data.paymentUrl;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading hostel details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-red-500">Error: {error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Hostel not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const totalReviews = hostel.reviews?.length || 0;
  const averageRating =
    hostel.reviews?.length > 0
      ? (hostel.reviews.reduce((sum, review) => sum + review.rating, 0) / hostel.reviews.length).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{hostel.name}</h1>
          <p className="text-gray-600">
            {hostel.location}, {hostel.city}
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            {hostel.contact?.phone && (
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <span className="font-medium">Phone:</span> {hostel.contact.phone}
              </div>
            )}
            <div className snatched="bg-gray-100 px-4 py-2 rounded-lg">
              <span className="font-medium">Type:</span> {hostel.hostelType}
            </div>
            {hostel.contact?.email && (
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <span className="font-medium">Email:</span> {hostel.contact.email}
              </div>
            )}
            {(hostel.owner?.name || hostel.ownername) && (
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <span className="font-medium">Owner:</span> {hostel.owner?.name || hostel.ownername}
              </div>
            )}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Gallery</h2>
            {hostel.images360?.length > 0 && (
              <button
                onClick={() => setShow360(!show360)}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
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
                    key={`360-${index}`}
                    className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg"
                  >
                    <iframe
                      src={`${url}?logo=0&info=0&fs=1&vr=0&thumbs=1`}
                      className="absolute inset-0 w-full h-full"
                      allow="xr-spatial-tracking; gyroscope; accelerometer; fullscreen"
                      allowFullScreen
                      loading="lazy"
                      title={`360° View of ${hostel.name} - ${index + 1}`}
                    />
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
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
                <p className="mt-2 text-gray-500">No 360° images available</p>
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {hostel.images?.length > 0 ? (
                hostel.images.map((img, index) => (
                  <div
                    key={index}
                    className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                  >
                    <img
                      src={img}
                      alt={`${hostel.name} - Photo ${index + 1}`}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-white font-medium">Photo {index + 1}</span>
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
                  <p className="mt-2 text-gray-500">No photos available</p>
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

        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Hostel Details
            </button>
            <button
              onClick={() => setActiveTab('amenities')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'amenities'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Hostel Features
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reviews'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reviews
            </button>
          </div>
        </div>

        <div className="mb-8">
          {activeTab === 'details' && (
            <div>
              <p className="text-gray-700 mb-6">{hostel.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailCard title="Hostel Type" value={hostel.hostelType} />
                <DetailCard
                  title="Price Range"
                  value={`Rs. ${hostel.priceRange.min} - Rs. ${hostel.priceRange.max}`}
                />
                <DetailCard title="Location" value={`${hostel.location}, ${hostel.city}`} />
                {hostel.contact?.phone && <DetailCard title="Contact" value={hostel.contact.phone} />}
              </div>
            </div>
          )}

          {activeTab === 'amenities' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Hostel Features</h3>
              {hostel.amenities && hostel.amenities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {hostel.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center bg-gray-50 p-3 rounded-lg">
                      <span className="mr-2 text-green-500">✔</span>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No amenities listed.</p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              {hostel.reviews && hostel.reviews.length > 0 ? (
                <div className="space-y-6">
                  {hostel.reviews.map((review, index) => (
                    <ReviewCard key={index} review={review} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No reviews yet.</p>
              )}
            </div>
          )}
        </div>

        {hostel.mapEmbedUrl && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Location</h2>
            <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg border border-gray-200">
              <div dangerouslySetInnerHTML={{ __html: hostel.mapEmbedUrl }} />
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setShowBooking(!showBooking)}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition duration-200"
          >
            {showBooking ? 'Cancel' : 'Book Now'}
          </button>
          {hostel.contact?.phone && (
            <a
              href={`tel:${hostel.contact.phone}`}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg transition duration-200"
            >
              Contact Owner
            </a>
          )}
        </div>

        {showBooking && (
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-bold mb-4">Book Your Stay</h2>
            {rooms.length === 0 ? (
              <p className="text-gray-600">No rooms available at the moment.</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select Room</label>
                  <select
                    name="roomId"
                    value={bookingForm.roomId}
                    onChange={handleBookingChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">Select a room</option>
                    {rooms.map((room) => (
                      <option key={room._id} value={room._id}>
                        {room.roomNumber} ({room.roomType}) - Rs. {room.price}/night
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Check-in Date</label>
                  <input
                    type="date"
                    name="checkInDate"
                    value={bookingForm.checkInDate}
                    onChange={handleBookingChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Check-out Date</label>
                  <input
                    type="date"
                    name="checkOutDate"
                    value={bookingForm.checkOutDate}
                    onChange={handleBookingChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    min={bookingForm.checkInDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
                <button
                  onClick={handleBookNow}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Proceed to Payment
                </button>
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

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow duration-300">
    <div className="text-2xl mb-1">{icon}</div>
    <h3 className="font-bold text-lg">{value}</h3>
    <p className="text-gray-600 text-sm">{title}</p>
  </div>
);

const DetailCard = ({ title, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300">
    <h3 className="font-medium text-gray-700">{title}</h3>
    <p className="text-gray-900">{value}</p>
  </div>
);

const ReviewCard = ({ review }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center mb-2">
      <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center">
        <span className="text-gray-600">👤</span>
      </div>
      <div>
        <h4 className="font-medium">User {review.userId?.toString().slice(-4)}</h4>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
              ★
            </span>
          ))}
        </div>
      </div>
    </div>
    <p className="text-gray-700">{review.comment}</p>
    <p className="text-gray-500 text-sm mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
  </div>
);

export default HostelDetails;