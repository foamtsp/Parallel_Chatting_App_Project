const mongoose = require('mongoose');

const userRecordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name.'],
  },
  groupName: {
    type: String,
    required: [true, 'Please provide a group name.'],
  },
  leaveTimestamp: {
    type: Date,
    default: Date.now(),
  },
});

const UserRecord = mongoose.model('UserRecord', userRecordSchema);

module.exports = UserRecord;
