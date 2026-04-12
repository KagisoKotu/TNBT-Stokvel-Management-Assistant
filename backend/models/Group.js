const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    groupName: { type: String, required: true, unique: true },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required: true},
    creationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Group', GroupSchema);



