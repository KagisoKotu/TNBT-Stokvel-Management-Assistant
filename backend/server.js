require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // IMPORTANT: Added this for frontend connection

// Route Imports
const stokvelRoutes = require('./routes/stokvelRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const usersRoutes = require('./routes/usersRoutes');

const app = express();

// Middleware
app.use(cors()); // Allows your React app (localhost:3000) to talk to this API
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 5000;

// Database Connection
const connectionOptions = {
    serverSelectionTimeoutMS: 10000, 
    socketTimeoutMS: 45000,          
};

mongoose.connect(process.env.MONGO_URI, connectionOptions)
    .then(() => console.log('Connected to Stokvel MongoDB'))
    .catch(err => {
        console.error('Database Connection Error:', err.message);
    });

// API Status Route
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'TNBT Stokvel Management Assistant API is running',
    endpoints: ['/api/stokvel', '/api/auth', '/api/users', '/api/admin']
  });
});

// Use Routes
app.use('/api/auth', authRoutes);     // The Google Login handshake happens here
app.use('/api/stokvel', stokvelRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', usersRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});