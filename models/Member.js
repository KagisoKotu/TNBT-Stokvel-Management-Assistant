const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    group: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Group', 
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
