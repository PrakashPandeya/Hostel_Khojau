// Hostel Card Component
const HostelCard = ({ hostel }) => {
    return (
      <div className="bg-white rounded-lg overflow-hidden shadow-md">
        <div className="relative">
          <img 
            src={hostel.images[0] || 'https://via.placeholder.com/400x300'} 
            alt={hostel.name} 
            className="w-full h-48 object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1">{hostel.name}</h3>
          <p className="text-gray-600 text-sm mb-2">
            <span className="font-medium">Location:</span> {hostel.location}, {hostel.city}
          </p>
          <p className="text-gray-600 text-sm mb-2">
            <span className="font-medium">Type:</span> {hostel.hostelType}
          </p>
          <p className="text-gray-600 text-sm mb-3">
            <span className="font-medium">Price:</span> Rs. {hostel.priceRange.min} - Rs. {hostel.priceRange.max}
          </p>
          <Link 
            to={`/hostels/${hostel._id}`}
            className="block w-full bg-red-500 hover:bg-red-600 text-white text-center py-2 rounded-md transition duration-200"
          >
            View Details
          </Link>
        </div>
      </div>
    );
  };
  