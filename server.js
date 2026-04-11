<<<<<<< HEAD
const express = require('express');
const stokvelRoutes = require('./routes/stokvelRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'TNBT Stokvel Management Assistant API',
    routes: ['/api/stokvel']
  });
});

app.use('/api/stokvel', stokvelRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
=======
require('dotenv').config();
const dns = require('dns');
// This forces Node to use Google's DNS for this app only
dns.setServers(['8.8.8.8', '8.8.4.4']); 

const express = require('express');
const mongoose = require('mongoose');

const User = require('./models/User');
const Group = require('./models/Group');
const Member = require('./models/Member');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

console.log('--- Stokvel Management System ---');
console.log('Checking environment...');

// Verify .env is working
if (process.env.MONGO_URI) {
    console.log('URI Loaded: YES');
} else {
    console.log('URI Loaded: NO (Check your .env file)');
}

// 1. We must define the options BEFORE we use them
const connectionOptions = {
    serverSelectionTimeoutMS: 10000, // Wait 10 seconds for a response
    socketTimeoutMS: 45000,          // Keep the connection open for 45 seconds
};

// 2. Database Connection using the defined options
mongoose.connect(process.env.MONGO_URI, connectionOptions)
    .then(() => console.log('Connected to Stokvel MongoDB'))
    .catch(err => {
        console.error('Database Connection Error:');
        console.error(err.message);
    });

// Basic Route for Testing
app.get('/', (req, res) => {
    res.send('Stokvel Backend is Running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
>>>>>>> 9740726 ( database architecture and models for Sprint 1)
