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
    }, {
      new: true
    });

    if (!newMessage) {
      res.status(404).json({
        status: 'fail',
        message: 'Not Found this message with that message id.',
      });
      throw new Error('Not Found this message with that message id.');
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

// deleteMessage
// deleteAllgroupMessages