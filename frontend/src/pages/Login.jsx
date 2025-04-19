import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import loginImage from '../assets/login.jpg';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        
        if (!email || !password) {
            return handleError('Email and password are required');
        }

        try {
            const response = await axios.post('http://localhost:5000/api/auth/Login', {
                email,
                password
            });
            
            const { token, user } = response.data;
            
            handleSuccess(`Welcome back, ${user.name}!`);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            // Redirect based on role
            setTimeout(() => {
                if (user.role === 'admin') {
                    navigate('/admin/dashboard');
                } else if (user.role === 'owner') {
                    navigate('/owner/hostels');
                } else {
                    navigate('/home');
                }
            }, 1000);
        } catch (error) {
            handleError(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen w-full">
            <div className="flex items-center justify-between bg-white p-8 rounded-lg w-full max-w-4xl mx-auto shadow-lg">
                <div className="flex-1 mr-5">
                    <h1 className="text-2xl font-bold mb-5">Login</h1>
                    <form onSubmit={handleLogin} className="flex flex-col">
                        <div>
                            <label htmlFor="email" className="block text-xl mb-2">Email</label>
                            <input
                                onChange={handleChange}
                                type="email"
                                name="email"
                                placeholder="Enter your email..."
                                value={loginInfo.email}
                                className="w-full mb-4 p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-xl mb-2">Password</label>
                            <input
                                onChange={handleChange}
                                type="password"
                                name="password"
                                placeholder="Enter your password..."
                                value={loginInfo.password}
                                className="w-full mb-4 p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <button 
                            type="submit"
                            className="w-32 h-9 p-2 bg-green-500 text-white border-none rounded cursor-pointer mt-3"
                        >
                            Login
                        </button>
                        <span className="mt-3 inline-block">
                            Doesn't have an account? <Link to="/signup" className="text-blue-500">Signup</Link>
                        </span>
                    </form>
                </div>
                <div className="flex-1 flex justify-center items-center">
                    <img src={loginImage} alt="Login Illustration" className="max-w-full rounded-lg" />
                </div>
                <ToastContainer />
            </div>
        </div>
    );
}

export default Login;