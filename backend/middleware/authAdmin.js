require('dotenv').config();
const jwt = require('jsonwebtoken');
const Admin = require('../models/AdminModel'); 

const authAdmin = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('BEARER ', ''); // Get token from header

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    console.log(token);

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use the secret key for token verification

        console.log(decoded);
        // Check if the decoded token contains admin privileges
        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Attach the admin to the request object and move to the next middleware/route handler
        req.admin = admin;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = { authAdmin };