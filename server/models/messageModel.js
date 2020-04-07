const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  author: {
    type: String,
    required: [true, 'Messages must have an author.'],
  },
  group: {
    type: mongoose.Schema.ObjectId,
    ref: 'Group',
  },
  text: {
    type: String,
    required: [true, 'A message must have at least one character.'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  },
});

messageSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'group',
    select: 'groupName',
  });
  next();
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
