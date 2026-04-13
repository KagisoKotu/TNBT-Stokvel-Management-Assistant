const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Coordinate with Backend Dev 1 for this
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
    const { idToken } = req.body;

    try {
        // 1. Verify Google Token
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { sub, email, name, picture } = ticket.getPayload();

        // 2. Find or Create User (User Provisioning)
        let user = await User.findOne({ googleId: sub });
        
        if (!user) {
            user = await User.create({
                googleId: sub,
                email,
                name,
                role: 'member' // Default role for new users
            });
        }

        // 3. Generate Application JWT (Token Management)
        const appToken = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({ token: appToken, role: user.role });
    } catch (error) {
        res.status(401).json({ message: "Authentication failed" });
    }
};
