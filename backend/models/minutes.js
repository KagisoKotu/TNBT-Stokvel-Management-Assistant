const mongoose = require('mongoose');

const MinutesSchema = new mongoose.Schema({
  
  meetingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meeting',
    required: true
  },
  
  groupId: {
    type: String, 
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String, 
    required: true
  },
  attendance: [
    {
      memberName: String,
      present: Boolean
    }
  ],
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Minutes', MinutesSchema);