// controllers/minutesController.js
const Minutes = require('../models/minutes'); // Pointing to your existing file

const saveMinutes = async (req, res) => {
  try {
    const { groupId } = req.params;
    // Extracting the exact fields your schema requires
    const { meetingId, title, content, attendance } = req.body;

    // 1. Validation based on schema 'required: true' fields
    if (!meetingId || !title || !content) {
      return res.status(400).json({ 
        message: 'meetingId, title, and content are required fields.' 
      });
    }

    // 2. Create the new minutes record
    const newMinutes = new Minutes({
      groupId,
      meetingId,
      title,
      content,
      attendance: attendance || []
    });

    // 3. Save to the database
    await newMinutes.save();

    return res.status(201).json({ 
      message: 'Minutes saved to the database successfully!', 
      minutes: newMinutes 
    });

  } catch (error) {
    console.error('Error saving minutes:', error);
    return res.status(500).json({ 
      message: 'Server error: Could not save minutes. Please try again.' 
    });
  }
};

module.exports = { saveMinutes };