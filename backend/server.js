require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); 

const express = require('express');
const mongoose = require('mongoose');
const stokvelRoutes = require('./routes/stokvelRoutes');

const User = require('./models/User');
const Group = require('./models/Group');
const Member = require('./models/Member');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 5000;

const connectionOptions = {
    serverSelectionTimeoutMS: 10000, 
    socketTimeoutMS: 45000,          
};

mongoose.connect(process.env.MONGO_URI, connectionOptions)
    .then(() => console.log('Connected to Stokvel MongoDB'))
    .catch(err => {
        console.error('Database Connection Error:');
        console.error(err.message);
    });

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

