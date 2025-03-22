import React from 'react';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer'; 

const HostelPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-6">
        {/* Search Filter Section (Horizontal, Above Hostels Connected With Us) */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
          <div className="flex items-center gap-4">
            {/* Hostel Name */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">HOSTEL NAME</label>
              <input
                type="text"
                placeholder="Hostel Name"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Institute */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">INSTITUTE</label>
              <select
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Filter By Institute</option>
                <option value="Institute 1">Institute 1</option>
                <option value="Institute 2">Institute 2</option>
                <option value="Institute 3">Institute 3</option>
              </select>
            </div>

            {/* City */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">CITY</label>
              <input
                type="text"
                placeholder="Eg: Kathmandu"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Gender */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">GENDER</label>
              <select
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select a gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">PRICE</label>
              <select
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select Price Range</option>
                <option value="0-5000">0 - 5000</option>
                <option value="5000-10000">5000 - 10000</option>
                <option value="10000-15000">10000 - 15000</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex-1 self-end">
              <button className="w-full bg-red-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Hostels Connected With Us Section */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Hostels Connected With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Hostel Image */}
                <div className="bg-gray-200 h-48">
                  <img src="" alt={`Hostel ${num}`} className="w-full h-full object-cover" />
                </div>

                {/* Hostel Details */}
                <div className="p-4">
                  <h3 className="font-medium mb-2">Hostel {num}</h3>
                  <div className="flex text-yellow-400 mb-2">★★★★★</div>
                  <button className="w-full bg-red-500 text-white py-2 rounded-md text-sm hover:bg-red-600 transition-colors">
                    View More about Hostel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Map Section */}
        <div className="col-span-2">
          <div className="w-full h-full rounded-lg overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d659.3639734833907!2d85.32542478861465!3d27.707615213544113!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1908434cb3c5%3A0x1fdf1a6d41d2512d!2sIslington%20College!5e0!3m2!1sen!2snp!4v1737220565479!5m2!1sen!2snp"
              className="w-full h-full"
              style={{ border: 0, minHeight: '400px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Recommended Hostels Section */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Recommended Hostels</h2>
          <div className="space-y-6">
            {[1, 2, 3].map((num) => (
              <div key={num} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex">
                  {/* Hostel Image */}
                  <div className="w-1/3">
                    <div className="bg-gray-200 h-48">
                      <img src="" alt={`Hostel ${num}`} className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* Hostel Details */}
                  <div className="w-2/3 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Hostel {num}</h3>
                        <p className="text-gray-600 text-sm mb-4">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button className="bg-red-500 text-white px-6 py-2 rounded-md text-sm hover:bg-red-600 transition-colors">
                        View More
                      </button>
                      <button className="bg-red-500 text-white px-6 py-2 rounded-md text-sm hover:bg-red-600 transition-colors">
                        View Available Rooms
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer /> 
    </div>
  );
};

export default HostelPage;
