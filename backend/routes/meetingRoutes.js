const express = require('express');
const Agenda = require('../models/Agenda'); //point to agenda
const router = express.Router();
const Meeting = require('../models/Meeting');

router.post('/agenda', async (req, res) => {
  try {
    // 1. Take the data Gomolemo's frontend sent and pour it into the Blueprint
    const newAgenda = new Agenda(req.body);

    // 2. MongoDB saves it permanently
    const savedAgenda = await newAgenda.save();

    // 3. Sending a success message AND the saved data back to the frontend UI
    res.status(201).json({ 
      message: "Agenda successfully posted to MongoDB!", 
      data: savedAgenda 
    });
    
  } catch (err) {
    console.error("MongoDB Save Error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/agenda/:groupId', async (req, res) => {
  try {
    // 1. Grab the VIP wristband (groupId) from the URL
    const { groupId } = req.params;

    // 2. Ask MongoDB: "Find every agenda that belongs to this specific group!"
    const groupAgendas = await Agenda.find({ groupId: groupId });

    // 3. Send those agendas back to the frontend
    res.status(200).json(groupAgendas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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