import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PendingApproval = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Account Pending Approval</h1>
        <p className="text-lg text-gray-600 mb-6">
          Thank you for signing up as a hostel owner! Your account is currently under review by our admin team. You will be notified once your account is approved, after which you can register your hostel.
        </p>
        <p className="text-sm text-gray-500">
          If you have any questions, please contact support at support@hostelkhojau.com.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default PendingApproval;