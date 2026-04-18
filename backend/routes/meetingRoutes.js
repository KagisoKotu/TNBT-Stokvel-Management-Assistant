const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting'); 


router.post('/schedule', async (req, res) => {
  try {
    const newMeeting = new Meeting(req.body);
    const savedMeeting = await newMeeting.save();
    res.status(201).json(savedMeeting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ meetingDate: 1 });
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;