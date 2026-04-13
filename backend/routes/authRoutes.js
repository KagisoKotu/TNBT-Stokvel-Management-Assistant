const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');


router.post('/google-login', async (req, res) => {
    try {
        const { email, name, picture } = req.body;

        // Check if user exists, otherwise create them
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                email,
                name,
                picture,
                role: 'Member' // New users start as members
            });
        }

        // Create JWT token using the JWT_SECRET 
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Send back the token and user details
        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Auth Error:", error);
        res.status(500).json({ message: "Internal Server Error during auth" });
    }
});

module.exports = router;
