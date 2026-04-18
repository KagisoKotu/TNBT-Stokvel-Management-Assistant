require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 

// Route Imports
const stokvelRoutes = require('./routes/stokvelRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const usersRoutes = require('./routes/usersRoutes');

const app = express();

// --- Middleware ---
app.use(cors()); // Allows frontend (3000) to talk to backend (5000)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request Logger
app.use((req, res, next) => {
    console.log(`${req.method} request received at ${req.url}`);
    next();
});

const PORT = process.env.PORT || 5000;

// --- Database Connection ---
const connectionOptions = {
    serverSelectionTimeoutMS: 10000, 
    socketTimeoutMS: 45000,          
};

mongoose.connect(process.env.MONGO_URI, connectionOptions)
    .then(() => {
        console.log('Connected to Stokvel MongoDB');

        // --- TEMPORARY FIX: DROP THE BAD INDEX ---
        // This runs once when the server starts to clear the 'duplicate null' error
        const dropOldIndex = async () => {
            try {
                // Access the underlying MongoDB driver to drop the index directly
                await mongoose.connection.db.collection('users').dropIndex('googleId_1');
                console.log('SUCCESS: Old googleId index dropped! Multiple users can now sign in.');
            } catch (err) {
                if (err.message.includes('not found')) {
                    console.log('Index Status: Old index already gone. Your database is clean.');
                } else {
                    console.log('Index Note:', err.message);
                }
            }
        };
        dropOldIndex();
        // --- END TEMPORARY FIX ---
    })
    .catch(err => {
        console.error('Database Connection Error:', err.message);
    });


app.use('/api/stokvel', stokvelRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/meetings', require('./routes/meetingRoutes'));

app.get('/', (req, res) => {
    res.send('Stokvel Assistant API is running!');
});

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
module.exports = app;