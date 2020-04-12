const mongoose = require('mongoose');

const userRecordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name.'],
  },
  group: {
    type: mongoose.Schema.ObjectId,
    ref: 'Group',
  },
  leaveTimestamp: {
    type: Date,
    default: new Date(),
  },
  joinAt:{
    type: Date
  }
});

userRecordSchema.index({
  name: 1
});

userRecordSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'group',
    select: 'groupName',
  });
  next();
});

const UserRecord = mongoose.model('UserRecord', userRecordSchema);

module.exports = UserRecord;