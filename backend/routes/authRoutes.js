const express = require('express');
const router = express.Router();

// Placeholder for future middleware
// const { verifyToken } = require('../middleware/authMiddleware');

// Route: POST /api/auth/google
// Description: Handle Google login/registration
// Access: Public
router.post('/google', (req, res) => {
  const { token } = req.body;

  // TODO for Backend Dev 2:
  // 1. Verify the Google token using 'google-auth-library'
  // 2. Check if the user's Google ID exists in your MongoDB database
  // 3. If they are new, create a new User document (leave role blank or 'pending')
  // 4. Generate your own JSON Web Token (JWT)
  // 5. Send the JWT and user data back to the frontend
  res.status(200).json({ message: 'Google Auth endpoint hit successfully. Token verification pending.' });
});

// Route: POST /api/auth/logout
// Description: Logout user and clear session
// Access: Private
router.post('/logout', (req, res) => {
  // In JWT-based auth, logging out is usually handled by the frontend deleting the token.
  // However, this endpoint can be used for refresh token or cookie cleanup if needed.
  res.status(200).json({ message: 'Logged out successfully.' });
});

module.exports = router;
