const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
  groupId: { type: String, required: true }, 
  meetingTitle: { type: String, required: true },
  purpose: String,
  meetingDate: { type: String, required: true }, 
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  locationType: { type: String, required: true },
  platform: String,
  meetingLink: String,
  physicalLocation: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Meeting', MeetingSchema);