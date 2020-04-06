const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name.'],
        unique: true
    },
    groups: {
        type: [String],
        default: []
    },
    groupTimeStamps: {
        type: [Date],
        default: []
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    loggedoutAt: Date
});

const User = mongoose.model('User', userSchema);

module.exports = User;