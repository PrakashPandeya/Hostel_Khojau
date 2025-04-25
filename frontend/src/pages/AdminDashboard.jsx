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
  const [activeTab, setActiveTab] = useState('pending-users');
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPendingUsers = pendingUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPendingHostels = pendingHostels.filter(hostel => 
    hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    hostel.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hostel.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (hostel.owner?.name && hostel.owner.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Admin Dashboard</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
            />
            <svg 
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('pending-users')}
                className={`${
                  activeTab === 'pending-users'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center mx-4`}
              >
                Pending Users
                {pendingUsers.length > 0 && (
                  <span className={`${
                    activeTab === 'pending-users' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900'
                  } ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium`}>
                    {pendingUsers.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('pending-hostels')}
                className={`${
                  activeTab === 'pending-hostels'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center mx-4`}
              >
                Pending Hostels
                {pendingHostels.length > 0 && (
                  <span className={`${
                    activeTab === 'pending-hostels' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900'
                  } ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium`}>
                    {pendingHostels.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`${
                  activeTab === 'users'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm mx-4`}
              >
                All Users
              </button>
            </nav>
          </div>

          <div className="p-4">
            {/* Pending Users Tab */}
            {activeTab === 'pending-users' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center px-4 py-3 bg-gray-50 rounded-lg">
                  <h2 className="text-sm font-medium text-gray-500">NAME</h2>
                  <h2 className="text-sm font-medium text-gray-500 hidden md:block">EMAIL</h2>
                  <h2 className="text-sm font-medium text-gray-500 hidden lg:block">ROLE</h2>
                  <h2 className="text-sm font-medium text-gray-500">ACTION</h2>
                </div>
                {filteredPendingUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M18 14v4.75A2.25 2.25 0 0115.75 21h-9.5A2.25 2.25 0 014 18.75V9.25A2.25 2.25 0 016.25 7h4.75"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 7h3a2 2 0 012 2v3"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 17l-6-6m.5-3.5a.5.5 0 11-1 0 .5.5 0 011 0z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No pending users</h3>
                    <p className="mt-1 text-sm text-gray-500">There are no pending user approvals at this time.</p>
                  </div>
                ) : (
                  filteredPendingUsers.map(user => (
                    <div 
                      key={user._id} 
                      className="flex justify-between items-center px-4 py-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
                    >
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-gray-500 hidden md:block truncate max-w-xs">{user.email}</div>
                      <div className="text-gray-500 hidden lg:block">{user.role}</div>
                      <button
                        onClick={() => handleApproveUser(user._id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Approve
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Pending Hostels Tab */}
            {activeTab === 'pending-hostels' && (
              <div className="space-y-4">
                {filteredPendingHostels.length === 0 ? (
                  <div className="text-center py-12">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No pending hostels</h3>
                    <p className="mt-1 text-sm text-gray-500">There are no pending hostel approvals at this time.</p>
                  </div>
                ) : (
                  filteredPendingHostels.map(hostel => (
                    <div key={hostel._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="px-6 py-4">
                        <div className="flex justify-between">
                          <h3 className="font-bold text-lg text-gray-800">{hostel.name}</h3>
                          <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Pending</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="text-sm text-gray-500">Owner</p>
                            <p className="text-gray-900">{hostel.owner?.name || 'Unknown'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="text-gray-900">{hostel.location}, {hostel.city}</p>
                          </div>
                        </div>
                      </div>
                      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex flex-wrap gap-2">
                        <button
                          onClick={() => handleApproveHostel(hostel._id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <svg className="mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectHostel(hostel._id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <svg className="mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Reject
                        </button>
                        <button
                          onClick={() => navigate(`/hostels/${hostel._id}`)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <svg className="mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* All Users Tab */}
            {activeTab === 'users' && (
              <div className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="px-6 py-12 text-center text-sm text-gray-500">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map(user => (
                          <tr key={user._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {user.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.role === 'admin' 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : user.role === 'owner'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.isApproved 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {user.isApproved ? 'Approved' : 'Pending'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
                <p className="text-3xl font-bold text-gray-700 mt-1">{users.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Pending Users</h3>
                <p className="text-3xl font-bold text-gray-700 mt-1">{pendingUsers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Pending Hostels</h3>
                <p className="text-3xl font-bold text-gray-700 mt-1">{pendingHostels.length}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default AdminDashboard;