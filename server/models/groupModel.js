const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: [true, 'Please fill the group name.'],
        unique: true
    },
    members: { // rel to user Object
        type: [String],
        required: [true, 'Group must have at least one member.']
    },
    messages: { // rel to message Object
        type: [String]
    }
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;