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
      if (!token) {
        toast.error('Please login');
        setTimeout(() => navigate('/login'), 1000);
        return;
      }

      try {
        setLoading(true);
        const [hostelsResponse, usersResponse, pendingUsersResponse] = await Promise.all([
          api.get('/admin/hostels/pending', {
            headers: { 'x-auth-token': token }
          }).catch(err => {
            console.error('Error fetching pending hostels:', err.response?.data || err.message);
            throw err;
          }),
          api.get('/admin/users', {
            headers: { 'x-auth-token': token }
          }).catch(err => {
            console.error('Error fetching users:', err.response?.data || err.message);
            throw err;
          }),
          api.get('/auth/pending', {
            headers: { 'x-auth-token': token }
          }).catch(err => {
            console.error('Error fetching pending users:', err.response?.data || err.message);
            throw err;
          })
        ]);
        setPendingHostels(hostelsResponse.data);
        setUsers(usersResponse.data);
        setPendingUsers(pendingUsersResponse.data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch data');
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
      toast.error(err.response?.data?.message || 'Failed to reject hostel');
    }
  };

  const handleApproveUser = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      await api.put(`/auth/approve/${userId}`, {}, {
        headers: { 'x-auth-token': token }
      });
      toast.success('User approved');
      setPendingUsers(pendingUsers.filter(u => u._id !== userId));
      setUsers(users.map(u => u._id === userId ? { ...u, isApproved: true } : u));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve user');
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
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Pending User Approvals</h2>
          {pendingUsers.length === 0 ? (
            <p className="text-gray-600">No pending users.</p>
          ) : (
            <div className="space-y-4">
              {pendingUsers.map(user => (
                <div key={user._id} className="bg-white rounded-lg shadow-md p-4">
                  <p className="text-gray-600">Name: {user.name}</p>
                  <p className="text-gray-600">Email: {user.email}</p>
                  <p className="text-gray-600">Role: {user.role}</p>
                  <button
                    onClick={() => handleApproveUser(user._id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    Approve
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Pending Hostel Approvals</h2>
          {pendingHostels.length === 0 ? (
            <p className="text-gray-600">No pending hostels.</p>
          ) : (
            <div className="space-y-4">
              {pendingHostels.map(hostel => (
                <div key={hostel._id} className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="font-bold text-lg mb-2">{hostel.name}</h3>
                  <p className="text-gray-600 mb-2">Owner: {hostel.owner?.name || 'Unknown'}</p>
                  <p className="text-gray-600 mb-2">Location: {hostel.location}, {hostel.city}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveHostel(hostel._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectHostel(hostel._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => navigate(`/hostels/${hostel._id}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
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
          <h2 className="text-2xl font-bold mb-4">Users</h2>
          {users.length === 0 ? (
            <p className="text-gray-600">No users found.</p>
          ) : (
            <div className="space-y-4">
              {users.map(user => (
                <div key={user._id} className="bg-white rounded-lg shadow-md p-4">
                  <p className="text-gray-600">Name: {user.name}</p>
                  <p className="text-gray-600">Email: {user.email}</p>
                  <p className="text-gray-600">Role: {user.role}</p>
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