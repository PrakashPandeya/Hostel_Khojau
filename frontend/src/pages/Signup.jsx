import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import RegisterImage from '../assets/register.jpg';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user' // Default to regular user
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password, role } = signupInfo;
        
        if (!name || !email || !password) {
            return handleError('Name, email, and password are required');
        }

        try {
            const response = await axios.post('/auth/signup', {
                name: signupInfo.name,
                email: signupInfo.email,
                password: signupInfo.password,
                role: signupInfo.role
            });
            
            handleSuccess(`Signup successful as ${role}!`);
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (error) {
            console.error('Signup error details:', error.response);
            handleError(error.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen w-full">
            <div className="flex items-center justify-between bg-white p-8 rounded-lg w-full max-w-4xl mx-auto shadow-lg">
                <div className="flex-1 mr-5">
                    <h1 className="text-2xl font-bold mb-5">Create an Account</h1>
                    <form onSubmit={handleSignup} className="flex flex-col">
                        <div>
                            <label htmlFor="name" className="block text-lg mb-2">Username</label>
                            <input
                                onChange={handleChange}
                                type="text"
                                name="name"
                                autoFocus
                                placeholder="Enter your name..."
                                value={signupInfo.name}
                                className="w-full mb-4 p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-lg mb-2">Email</label>
                            <input
                                onChange={handleChange}
                                type="email"
                                name="email"
                                placeholder="Enter your email..."
                                value={signupInfo.email}
                                className="w-full mb-4 p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-lg mb-2">Password</label>
                            <input
                                onChange={handleChange}
                                type="password"
                                name="password"
                                placeholder="Enter your password..."
                                value={signupInfo.password}
                                className="w-full mb-4 p-2 border border-gray-300 rounded"
                                required
                                minLength="6"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="role" className="block text-lg mb-2">Account Type</label>
                            <select
                                name="role"
                                onChange={handleChange}
                                value={signupInfo.role}
                                className="w-full p-2 border border-gray-300 rounded"
                            >
                                <option value="user">User</option>
                                <option value="owner">Hostel Owner</option>
                            </select>
                            <p className="text-sm text-gray-500 mt-1">
                                {signupInfo.role === 'owner' 
                                    ? "You'll be able to register hostels after approval"
                                    : "You'll be able to book hostels"}
                            </p>
                        </div>
                        <button 
                            type="submit"
                            className="w-32 h-9 p-2 bg-green-500 text-white border-none rounded cursor-pointer mt-3"
                        >
                            Signup
                        </button>
                        <span className="mt-3 inline-block">
                            Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
                        </span>
                    </form>
                </div>
                <div className="flex-1 flex justify-center items-center">
                    <img src={RegisterImage} alt="Signup Illustration" className="max-w-full rounded-lg" />
                </div>
                <ToastContainer />
            </div>
        </div>
    );
}

export default Signup;