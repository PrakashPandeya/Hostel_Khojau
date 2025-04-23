import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [pendingHostels, setPendingHostels] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

      if (!token) {
        toast.error('Please login');
        setTimeout(() => navigate('/login'), 1000);
        return;
      }

      if (!user || user.role !== 'admin') {
        toast.error('Unauthorized access');
        setTimeout(() => navigate('/home'), 1000);
        return;
      }

      try {
        setLoading(true);
        const [hostelsResponse, usersResponse, pendingUsersResponse] = await Promise.all([
          api.get('/admin/hostels/pending', {
            headers: { 'x-auth-token': token }
          }).catch(err => {
            console.error('Error fetching pending hostels:', err.response?.data || err.message);
            throw new Error(err.response?.data?.message || 'Failed to fetch pending hostels');
          }),
          api.get('/admin/users', {
            headers: { 'x-auth-token': token }
          }).catch(err => {
            console.error('Error fetching users:', err.response?.data || err.message);
            throw new Error(err.response?.data?.message || 'Failed to fetch users');
          }),
          api.get('/admin/pending-owners', {
            headers: { 'x-auth-token': token }
          }).catch(err => {
            console.error('Error fetching pending users:', err.response?.data || err.message);
            throw new Error(err.response?.data?.message || 'Failed to fetch pending users');
          })
        ]);

        setPendingHostels(hostelsResponse.data || []);
        setUsers(usersResponse.data || []);
        setPendingUsers(pendingUsersResponse.data || []);
      } catch (err) {
        console.error('Fetch data error:', err);
        toast.error(err.message || 'Failed to fetch data');
        setPendingHostels([]);
        setUsers([]);
        setPendingUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleApproveHostel = async (hostelId) => {
    const token = localStorage.getItem('token');
    try {
      await api.put(`/admin/hostels/${hostelId}/approve`, {}, {
        headers: { 'x-auth-token': token }
      });
      toast.success('Hostel approved');
      setPendingHostels(pendingHostels.filter(h => h._id !== hostelId));
    } catch (err) {
      console.error('Approve hostel error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Failed to approve hostel');
    }
  };

  const handleRejectHostel = async (hostelId) => {
    const token = localStorage.getItem('token');
    try {
      await api.put(`/admin/hostels/${hostelId}/reject`, {}, {
        headers: { 'x-auth-token': token }
      });
      toast.success('Hostel rejected');
      setPendingHostels(pendingHostels.filter(h => h._id !== hostelId));
    } catch (err) {
      console.error('Reject hostel error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Failed to reject hostel');
    }
  };

  const handleApproveUser = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      await api.put(`/admin/approve-owner/${userId}`, {}, {
        headers: { 'x-auth-token': token }
      });
      toast.success('User approved');
      setPendingUsers(pendingUsers.filter(u => u._id !== userId));
      setUsers(users.map(u => u._id === userId ? { ...u, isApproved: true } : u));
    } catch (err) {
      console.error('Approve user error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Failed to approve user');
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Pending User Approvals</h2>
          {pendingUsers.length === 0 ? (
            <p className="text-gray-600">No pending users.</p>
          ) : (
            <div className="space-y-4">
              {pendingUsers.map(user => (
                <div key={user._id} className="bg-white rounded-lg shadow-md p-6">
                  <p className="text-gray-600 mb-1">Name: {user.name}</p>
                  <p className="text-gray-600 mb-1">Email: {user.email}</p>
                  <p className="text-gray-600 mb-3">Role: {user.role}</p>
                  <button
                    onClick={() => handleApproveUser(user._id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-200"
                  >
                    Approve
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Pending Hostel Approvals</h2>
          {pendingHostels.length === 0 ? (
            <p className="text-gray-600">No pending hostels.</p>
          ) : (
            <div className="space-y-4">
              {pendingHostels.map(hostel => (
                <div key={hostel._id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-bold text-lg mb-2 text-gray-800">{hostel.name}</h3>
                  <p className="text-gray-600 mb-1">Owner: {hostel.owner?.name || 'Unknown'}</p>
                  <p className="text-gray-600 mb-3">Location: {hostel.location}, {hostel.city}</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApproveHostel(hostel._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-200"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectHostel(hostel._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => navigate(`/hostels/${hostel._id}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Users</h2>
          {users.length === 0 ? (
            <p className="text-gray-600">No users found.</p>
          ) : (
            <div className="space-y-4">
              {users.map(user => (
                <div key={user._id} className="bg-white rounded-lg shadow-md p-6">
                  <p className="text-gray-600 mb-1">Name: {user.name}</p>
                  <p className="text-gray-600 mb-1">Email: {user.email}</p>
                  <p className="text-gray-600 mb-1">Role: {user.role}</p>
                  <p className="text-gray-600">Approved: {user.isApproved ? 'Yes' : 'No'}</p>
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

export default AdminDashboard;