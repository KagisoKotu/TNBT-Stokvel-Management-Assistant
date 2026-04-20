const mongoose = require('mongoose');

const MinutesSchema = new mongoose.Schema({
  meetingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting' }, // Optional now, or pass it from React
  groupId: { type: String, required: true },
  
  // From the original schema
  title: { type: String }, 
  content: { type: String },
  attendance: [{ memberName: String, present: Boolean }],
  
  // Adding the fields from your awesome React Form
  meetingDate: { type: String },
  meetingTime: { type: String },
  contributions: [{
    member: String,
    amount: String,
    status: String
  }],
  decisions: [String],
  notes: String,
  
  dateCreated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Minutes', MinutesSchema);