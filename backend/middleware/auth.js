const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if user still exists
        const user = await User.findById(decoded.user.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Allow pending owners to register hostels and view chats
        if (user.role === 'owner' && !user.isApproved) {
            if (
                (req.path === '/api/hostels' && req.method === 'POST') ||
                (req.path.startsWith('/api/chats') && req.method === 'GET')
            ) {
                req.user = decoded.user;
                return next();
            }
            return res.status(403).json({ message: 'Account pending approval' });
        }

        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Role-based middleware
module.exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};