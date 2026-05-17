// backend/models/Payout.js
const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema({
  groupName: { 
    type: String, 
    required: false // Made false so frontend can use groupId instead if needed
  },
  groupId: { 
    type: String // Added this because frontend sends groupId
  },
  userId: { 
    type: String, 
    required: true 
  },
  userEmail: { 
    type: String, 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true,
    min: [0.01, 'Payout amount must be greater than zero'] // This handles Rule 2 automatically!
  },
  payoutDate: { 
    type: Date, 
    required: true 
  },

  // --- NEW FIELDS ADDED ---
  method: { type: String },    // 'bank' or 'cash'
  reference: { type: String }, // EFT ref
  notes: { type: String },     // Extra context

  status: { 
    type: String, 
    // Combined Gomolemo's statuses with my new statuses!
    enum: ['Scheduled', 'pending', 'Paid', 'failed', 'Cancelled'],
    default: 'Scheduled' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Payout', payoutSchema);