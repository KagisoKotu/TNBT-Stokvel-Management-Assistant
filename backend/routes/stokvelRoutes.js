const express = require('express');
const router = express.Router();
const Group = require('../models/Group'); // Ensure this path matches your Group model
const nodemailer = require('nodemailer');

// 1. Setup Nodemailer Transporter using your .env credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// @route   POST api/stokvels
// @desc    Create a new Stokvel group and send email invite
router.post('/', async (req, res) => {
  const { groupName, adminId, treasurerDetails, financials } = req.body;

  try {
    // 2. Create and Save the group to MongoDB
    const newGroup = new Group({
      groupName,
      adminId,
      treasurerDetails,
      financials,
    });

    const savedGroup = await newGroup.save();

    // 3. Setup the Email Content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: treasurerDetails.email,
      subject: `Initation: You've been added to ${groupName}`,
      text: `Hi ${treasurerDetails.firstName},\n\nYou have been officially added as the Treasurer for the "${groupName}" Stokvel group on the TNBT Management Assistant.\n\nPlease log in to your dashboard to manage the group funds.\n\nRegards,\nTNBT Team`,
    };

    // 4. Send the Email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Nodemailer Error:", error);
        // We don't send a 500 error here because the group WAS saved successfully
      } else {
        console.log("Email sent successfully: " + info.response);
      }
    });

    // 5. Respond to the Frontend
    res.status(201).json(savedGroup);

  } catch (err) {
    console.error("Database Error:", err.message);
    res.status(500).send('Server Error: Could not create group.');
  }
});

// @route   GET api/stokvels
// @desc    Get all groups (useful for your Dashboard later)
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;