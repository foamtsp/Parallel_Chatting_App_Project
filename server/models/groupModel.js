const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: [true, 'Please fill the group name.'],
        unique: true
    },
    members: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    messages: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Message'
    }]
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;