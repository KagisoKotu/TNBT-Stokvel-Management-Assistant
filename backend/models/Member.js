const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    user: { 
        type: String, // Changed from ObjectId to String
        required: true 
    },
    group: { 
        type: String, // Changed from ObjectId to String
        required: true 
    },
    memberType: { 
        type: String, 
        enum: ['Admin', 'Treasurer', 'Member'],
        default: 'Member'
    },
    joiningDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Member', MemberSchema);