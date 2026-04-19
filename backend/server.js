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
const managegroupRoutes = require('./routes/managegroupRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// --- Middleware ---
app.use(cors());
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
        const dropOldIndex = async () => {
            try {
                await mongoose.connection.db.collection('users').dropIndex('googleId_1');
                console.log('SUCCESS: Old googleId index dropped!');
            } catch (err) {
                if (err.message.includes('not found')) {
                    console.log('Index Status: Old index already gone.');
                } else {
                    console.log('Index Note:', err.message);
                }
            }
        };
        dropOldIndex();
    })
    .catch(err => {
        console.error('Database Connection Error:', err.message);
    });

// --- Routes ---
app.use('/api/auth', authRoutes);       // ← only registered ONCE
app.use('/api/stokvel', stokvelRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/managegroup', managegroupRoutes);
app.use('/api/meetings', meetingRoutes);           // ← only ONCE
app.use('/api/notifications', notificationRoutes); // ← yours

app.get('/', (req, res) => {
    res.send('Stokvel Assistant API is running!');
});

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});

const admin = require('firebase-admin');
const serviceAccount = require("./serviceAccountKey");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;