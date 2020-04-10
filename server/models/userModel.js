const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name.'],
    unique: true,
    trim: true,
    maxlength: [20, 'A username must have less or equal then 20 characters.'],
    minlength: [4, 'A username must have more or equal then 4 characters'],
  },
  messages: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Message'
  }],
  readMessages: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Message'
  }],
  unreadMessages: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Message'
  }],
  currentGroup: {
    type: mongoose.Schema.ObjectId,
    ref: 'Group'
  },
  userRecords: [{
    type: mongoose.Schema.ObjectId,
    ref: 'UserRecord'
  }],
  active: {
    type: Boolean,
    default: true,
  },
  loggedoutAt: Date,
});

userSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'userRecords',
    select: '-name',
  });
  this.populate({
    path: 'currentGroup',
    select: 'groupName'
  })
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;