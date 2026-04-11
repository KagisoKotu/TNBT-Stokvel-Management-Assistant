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
