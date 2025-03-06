import React from 'react';
import { Search, MapPin, Clock, Wifi, Bath, User } from 'lucide-react';
import HostelKhojauLogo from '../assets/HostelKhojauLogo.png';


const RoomPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 flex items-center justify-between py-4 px-8 bg-white border-b">
        <div className="flex items-center gap-12">
          <div className="flex items-center">
            <img src={HostelKhojauLogo} alt="Logo" className="h-10" />
          </div>
          <div className="flex space-x-8">
            <a href="./home" className="text-gray-600 text-lg">Home</a>
            <a href="./hostel" className="text-gray-600 text-lg">Hostels</a>
            <a href="room" className="text-black font-semibold text-lg">Rooms</a>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-64 px-4 py-2 bg-gray-100 rounded-full focus:outline-none"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button className="p-2">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-500" />
            </div>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-6">
        {/* Hostel Title Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Hostel 1</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>3 Rooms Available</span>
            </div>
            <div>Available from: March 2 (2nd year) & after</div>
            <div>Price Range: NPR 15k to 25k</div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Hostel Description</h2>
          <p className="text-gray-600">
            Located in a peaceful residential area, this hostel offers comfortable living spaces in a secure environment. 
            Private rooms with modern amenities and regular maintenance ensure a pleasant stay.
          </p>
        </div>

        {/* Services Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Bath className="h-5 w-5 text-gray-600" />
              <span>Hygienic Kitchen</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-gray-600" />
              <span>24/7 speed test electricity</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-600" />
              <span>Free shared laundry</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-600" />
              <span>24/7 CCTV system</span>
            </div>
          </div>
        </div>

        {/* Room Images Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Room Images</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2 row-span-2">
              <img src="/api/placeholder/400/400" alt="Room" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div>
              <img src="/api/placeholder/200/200" alt="Room" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div>
              <img src="/api/placeholder/200/200" alt="Room" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div>
              <img src="/api/placeholder/200/200" alt="Room" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="relative">
              <img src="/api/placeholder/200/200" alt="Room" className="w-full h-full object-cover rounded-lg" />
              
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Location</h2>
          <div className="h-64 bg-gray-200 rounded-lg">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d659.3639734833907!2d85.32542478861465!3d27.707615213544113!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1908434cb3c5%3A0x1fdf1a6d41d2512d!2sIslington%20College!5e0!3m2!1sen!2snp!4v1737220565479!5m2!1sen!2snp"
              className="w-full h-full rounded-lg"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Reviews</h2>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">4.5</span>
              <div className="flex text-yellow-400">★★★★★</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            {[1, 2].map((num) => (
              <div key={num} className="border-b pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                  <div>
                    <h3 className="font-medium">Ram</h3>
                    <div className="flex text-yellow-400 text-sm">★★★★★</div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Great location and friendly staff! The rooms are clean and well-maintained.
                  Would definitely recommend to others looking for accommodation.
                </p>
              </div>
            ))}
          </div>
          <button className="mt-4 text-blue-600 font-medium">Add review</button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 mt-8">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="grid grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="flex items-center">
                <img src={HostelKhojauLogo} alt="Logo" className="h-10" />
                <span className="ml-3 text-lg">Hostel Khojau</span>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600">Instagram</a>
                <a href="#" className="text-gray-600">Facebook</a>
                <a href="#" className="text-gray-600">Twitter</a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">CONTACT US</h3>
              <div className="space-y-2">
                <p className="text-gray-600">Hostelkhojau@gmail.com</p>
                <p className="text-gray-600">Kathmandu, Nepal</p>
                <p className="text-gray-600">+01 5236123</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Want to Connect?</h3>
              <p className="text-gray-600 mb-4">
                Be the first to know about hostels, special discounts, store openings,
                and much more. Connect with us.
              </p>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="w-full px-4 py-2 bg-gray-200 rounded-lg focus:outline-none" 
                />
                <button className="absolute right-2 top-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                    <path d="M22 2L11 13"></path>
                    <path d="M22 2L15 22 11 13 2 9l20-7z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RoomPage;