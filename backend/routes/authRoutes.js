const express = require('express');
const router = express.Router();
const User = require('../models/User'); 


router.post('/google', async (req, res) => {
    
    console.log("--- Auth Request Received ---");
    console.log("Payload:", req.body);

    const { email, name, surname } = req.body;

   
    if (!email || !name) {
        console.error("❌ Auth Failed: Missing email or name in request body");
        return res.status(400).json({ error: 'Missing required profile information from Google.' });
    }

    try {
        
        let user = await User.findOne({ email });

        if (!user) {
           
            user = new User({
                name: name,
                surname: surname || "", 
                email: email
            });

            await user.save();
            console.log(`✅ Success: New account created for ${email}`);
        } else {
            console.log(`ℹ️ Success: Existing user logged in: ${email}`);
        }

        // 5. Respond with the user data
        res.status(200).json({
            message: 'Authentication successful',
            user: user
        });

    } catch (err) {
        
        console.error("❌ Database Error during Auth:", err.message);
        res.status(500).json({ 
            error: 'Server Error: Could not process user data.',
            details: err.message 
        });
    }
});

module.exports = router;