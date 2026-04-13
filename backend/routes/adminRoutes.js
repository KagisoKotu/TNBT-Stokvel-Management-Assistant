const express = require('express');
const router = express.Router();

const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// checks if logged in, requireRole checks if they are an Admin
router.get('/dashboard', verifyToken, requireRole('admin'), (req, res) => {
  res.status(200).json({ message: 'Welcome to the Admin Dashboard' });
});

// Route: POST /api/admin/manage-users
router.post('/manage-users', verifyToken, requireRole('admin'), (req, res) => {
  // Logic for the Stokvel admin to manage members
  res.status(200).json({ message: 'User management endpoint accessed' });
});

module.exports = router;
