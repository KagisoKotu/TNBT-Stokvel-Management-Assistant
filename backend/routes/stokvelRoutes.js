const express = require('express');
const router = express.Router();

const stokvels = [
  { id: 1, name: 'Starter Stokvel', members: 5, contribution: 100 }
];

router.get('/', (req, res) => {
  res.json({ data: stokvels });
});

router.post('/', (req, res) => {
  const { name, members = 0, contribution = 0 } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }

  const newStokvel = {
    id: stokvels.length + 1,
    name,
    members,
    contribution,
    createdAt: new Date().toISOString()
  };

  stokvels.push(newStokvel);
  res.status(201).json(newStokvel);
});

module.exports = router;
