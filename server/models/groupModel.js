const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: [true, 'Please fill the group name.'],
    trim: true,
    unique: true,
  },
  members: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  messages: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Message',
    },
  ],
});

groupSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'members',
    select: 'name',
  });
  this.populate({
    path: 'messages',
    select: '-__v',
  });
  next();
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
