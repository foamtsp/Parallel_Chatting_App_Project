const Message = require('../models/messageModel');
const Group = require('../models/groupModel');

// Ex: req.body = { user: '<USER ID>', message: 'Hello' }
exports.sendMessage = async (req, res, next) => {
  try {
    // Create message to messageModel
    const groupName = req.params.name;
    const {
      userId,
      message
    } = req.body;

    // Check this group exists
    const group = await Group.findOne({
      groupName,
    });

    if (!group) {
      res.status(404).json({
        status: 'fail',
        message: 'Not Found this group with that group name.',
      });
      throw new Error('Not Found this group with that group name.');
    }

    const newMessage = await Message.create({
      author: userId,
      group: group._id,
      text: message,
    });

    // Add message id to the group
    await Group.findOneAndUpdate({
      groupName,
    }, {
      $push: {
        messages: newMessage._id,
      },
    });

    res.status(201).json({
      status: 'success',
      data: newMessage,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: (err.message)
    });
    throw new Error(err.message);
  }
};

// NOT USE
exports.editMessage = async (req, res, next) => {
  try {
    const msgId = req.params.id;
    const {
      userId,
      message
    } = req.body;

    const newMessage = await Message.findOneAndUpdate({
      _id: msgId,
      author: userId,
    }, {
      text: message,
      updatedAt: Date.now(),
    }, {
      new: true
    });

    if (!newMessage) {
      res.status(404).json({
        status: 'fail',
        message: 'This message dose not match with your user.',
      });
      throw new Error('This message dose not match with your user.');
    }

    res.status(200).json({
      status: 'success',
      data: newMessage,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: (err.message)
    });
    throw new Error(err.message);
  }
};

exports.getAllGroupMessages = async (req, res, next) => {
  try {
    const groupName = req.params.groupName;

    const group = await Group.find({
      groupName,
    }).populate({
      path: 'messages',
      select: '-group',
      model: 'Message',
    });

    if (!group) {
      res.status(404).json({
        status: 'fail',
        message: 'Not Found this group with that group name.',
      });
      throw new Error('Not Found this group with that group name.');
    }

    res.status(200).json({
      status: 'success',
      data: group.messages,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: (err.message)
    });
    throw new Error(err.message);
  }
};

// Delete Message
exports.deleteMessage = async (req, res, next) => {
  try {
    const msgId = req.params.id;

    // Delete message ID from group
    await Group.update({}, {
      $pull: {
        messages: msgId
      }
    });

    // Delete message
    await Message.findByIdAndDelete(msgId);

    res.json(204).json();

  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: (err.message)
    });
    throw new Error(err.message);
  };
};

// deleteAllgroupMessages
// GET params = groupName
exports.deleteAllGroupMessages = async (req, res, next) => {
  try {
    const groupName = req.params.name;

    // Delete all messages
    const group = await Group.findOne({
      groupName
    });

    if (!group) {
      res.status(404).json({
        status: 'fail',
        message: 'Not Found this group with that group name.',
      });
      throw new Error('Not Found this group with that group name.');
    }

    const messages = group.messages;
    const messagePromises = messages.map(message => {
      Message.findByIdAndRemove(message)
    });
    await Promise.all(messagePromises);

    // Delete messages on group
    const currentGroup = await Group.findOneAndUpdate({
      groupName
    }, {
      messages: []
    }, {
      new: true
    });

    res.status(200).json({
      status: 'success',
      data: currentGroup
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: (err.message)
    });
    throw new Error(err.message);
  }
}