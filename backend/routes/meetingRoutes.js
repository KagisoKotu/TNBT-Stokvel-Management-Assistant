const express = require('express');
const router = express.Router();

// --- Models ---
const Agenda = require('../models/Agenda'); 
const Meeting = require('../models/Meeting');
const Notification = require('../models/Notification');
const Member = require('../models/Member');

// --- Email Setup ---
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


// ==========================================
// AGENDA ROUTES
// ==========================================

// POST /meetings/agenda - Save a new agenda
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

// GET /meetings/agenda/:groupId - Fetch agendas for a specific group
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


// ==========================================
// SCHEDULING & MEETING ROUTES
// ==========================================

// POST /meetings/schedule — save meeting and notify all group members
router.post('/schedule', async (req, res) => {
  try {
    // 1. Save the meeting
    const newMeeting = new Meeting(req.body);
    const savedMeeting = await newMeeting.save();

    // 2. Find all members of this group
    const groupMembers = await Member.find({ group: req.body.groupId });

    if (groupMembers && groupMembers.length > 0) {
      for (let member of groupMembers) {
        
        // CRITICAL CHECK: 
        // Make sure 'member.user' is actually the email string. 
        // If your Member model stores email in 'member.email', change this to member.email
        const emailToNotify = member.user.toLowerCase(); 

        // 3. Save in-app notification for each member
        await Notification.create({
          recipient: emailToNotify, // Matches the lowercase fetch in notificationRoutes.js
          type: 'meeting',
          title: `Meeting Scheduled: ${req.body.meetingTitle}`,
          message: `A meeting has been scheduled for ${req.body.meetingDate} at ${req.body.startTime}. Location: ${req.body.locationType === 'online' ? req.body.meetingLink : req.body.physicalLocation}`,
          groupId: req.body.groupId,
          isRead: false // Ensuring it starts as unread so the red dot shows up!
        });

        // 4. Send email notification
        transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: emailToNotify,
          subject: `Meeting Scheduled: ${req.body.meetingTitle}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee;">
              <h2 style="color: #1A3A6B;">Meeting Notification</h2>
              <p>A new meeting has been scheduled for your stokvel group.</p>
              <hr/>
              <p><strong>Title:</strong> ${req.body.meetingTitle}</p>
              <p><strong>Date:</strong> ${req.body.meetingDate}</p>
              <p><strong>Time:</strong> ${req.body.startTime} - ${req.body.endTime}</p>
              <p><strong>Location:</strong> ${req.body.locationType === 'online' ? req.body.meetingLink : req.body.physicalLocation}</p>
              <hr/>
              <p>Log in to StokvèlHub to view more details.</p>
            </div>
          `
        }).catch(err => console.log('Email error:', err.message));
      }
      console.log(` Notifications sent to ${groupMembers.length} members`);
    }

    res.status(201).json(savedMeeting);
  } catch (err) {
    console.error('Meeting schedule error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /meetings — fetch all meetings
router.get('/', async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ meetingDate: 1 });
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /meetings/group/:groupId — fetch meetings for a specific group
router.get('/group/:groupId', async (req, res) => {
  try {
    const meetings = await Meeting.find({ groupId: req.params.groupId })
      .sort({ meetingDate: 1 });
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;