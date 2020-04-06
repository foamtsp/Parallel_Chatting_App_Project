const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  author: {
    type: String,
    required: [true, 'Messages must have an author.'],
  },
  groupName: {
    type: String,
    required: [true, 'Message must be contained within a group.'],
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

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
