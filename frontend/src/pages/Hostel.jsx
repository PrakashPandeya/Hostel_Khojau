import React from 'react';
import { Search } from 'lucide-react';
import HostelKhojauLogo from '../assets/HostelKhojauLogo.png';


const HostelPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 flex items-center justify-between py-4 px-8 bg-white border-b">
        <div className="flex items-center gap-12">
          <div className="flex items-center">
            <img src={HostelKhojauLogo} alt="Logo" className="h-10" />
          </div>
          <div className="flex space-x-8">
            <a href="../home/" className="text-gray-600 text-lg">Home</a>
            <a href="#" className="text-black font-semibold text-lg">Hostels</a>
            <a href="../room" className="text-gray-600 text-lg">Rooms</a>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </button>
        </div>
      </nav>

            
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-6">
        {/* Hostels Near You Section */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Hostels Connected With Us</h2>
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gray-200 h-48">
                  <img src="" alt="Hostel 1" className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-2">Hostel 1</h3>
                  <div className="flex text-yellow-400 mb-2">★★★★★</div>
                  <button className="w-full bg-red-500 text-white py-2 rounded-md text-sm">
                    View More about Hostel
                  </button>
                </div>
              </div>
            </div>


            
            {[2, 3, 4].map((num) => (
              <div key={num} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gray-200 h-48">
                  <img src="" alt={`Hostel ${num}`} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-2">Hostel {num}</h3>
                  <div className="flex text-yellow-400 mb-2">★★★★★</div>
                  <button className="w-full bg-red-500 text-white py-2 rounded-md text-sm">
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
                  <div className="w-1/3">
                    <div className="bg-gray-200 h-48">
                      <img src="" alt={`Hostel ${num}`} className="w-full h-full object-cover" />
                    </div>
                  </div>
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
                      <button className="bg-red-500 text-white px-6 py-2 rounded-md text-sm">
                        View More
                      </button>
                      <button className="bg-red-500 text-white px-6 py-2 rounded-md text-sm">
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
                <input type="email" placeholder="Email" className="w-full px-4 py-2 bg-gray-200 rounded-lg focus:outline-none" />
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

export default HostelPage;