const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    groupName: { type: String, required: true, unique: true },
    adminEmail: { type: String, required: true },    // Changed to String
    treasurerEmail: { type: String, required: true }, // Changed to String
    contributionAmount: { type: Number, required: true }, // Added for UI cards
    frequency: { type: String, default: 'Monthly' },     // Added for UI cards
    creationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Group', GroupSchema);

