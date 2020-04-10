const Message = require('../models/messageModel');
const Group = require('../models/groupModel');
const User = require('../models/userModel');
const UserRecord = require('../models/userRecordModel');

// Local function
exports.getUnreadMessages = async (record, groupName, res) => {
  try {
    const group = await Group.findOne({
      groupName,
    }).populate({
      path: 'messages',
      populate: {
        path: 'messages'
      },
      select: '-__v -group'
    });

    const allMessages = group.messages;
    let readMessages = [];
    let unreadMessages = [];

    allMessages.forEach(message => {
      if (message.createdAt < record.leaveTimestamp) {
        readMessages.push(message._id);
      } else {
        unreadMessages.push(message._id);
      }
    });

    return [
      readMessages,
      unreadMessages
    ]
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    })
    throw new Error(err.message);
  }
};

// Ex: req.body = { user: '<USER ID>', message: 'Hello' }
exports.sendMessage = async (req, res, next) => {
  try {
    // Create message to messageModel
    const groupName = req.params.name;
    const {
      name,
      message,
      time_stamp
    } = req.body;

    // Check existing user
    const user = await User.findOne({
      name
    });

    if (!user) {
      res.status(400).json({
        status: 'fail',
        message: 'This user name is not correct.'
      });
      throw new Error('This user name is not correct.');
    };

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

    /*
    if (!user.currentGroup || user.currentGroup.groupName !== groupName) {
      res.status(400).json({
        status: 'fail',
        message: 'This user not in this group.',
      });
      throw new Error('This user not in this group.');
    };
    */

    let newMessage = await Message.create({
      author: user.name,
      group: group._id,
      text: message,
      createdAt: time_stamp
    });

    // Add message id to user
    await User.findByIdAndUpdate({
      _id: user._id,
      currentGroup: groupName
    }, {
      $push: {
        messages: newMessage._id
      }
    });

    // Add message id to the group
    await Group.findOneAndUpdate({
      groupName,
    }, {
      $push: {
        messages: newMessage._id,
      },
    });

    newMessage = await newMessage.populate({
      path: 'group',
      select: 'groupName'
    }).execPopulate();

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

// Front-end NOT USE
exports.getAllMessages = async (req, res, next) => {
  try {
    const messages = await Message.find();

    res.status(200).json({
      status: 'success',
      data: messages
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: (err.message)
    });
    throw new Error(err.message);
  }
}

exports.getMessage = async (req, res, next) => {
  try {
    const msgId = req.params.id;
    const message = await Message.findOne({
      _id: msgId
    });

    if (!message) {
      res.status(404).json({
        status: 'fail',
        message: 'Not Found a message with that message ID.',
      });
      throw new Error('Not Found a message with that message ID.');
    };

    res.status(200).json({
      status: 'success',
      data: message
    });

  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: (err.message)
    });
    throw new Error(err.message);
  }
}

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

// Delete Message
exports.deleteMessage = async (req, res, next) => {
  try {
    const msgId = req.params.id;

    // Delete message ID from group
    await Group.updateMany({}, {
      $pull: {
        messages: msgId
      }
    });

    // Delete from user
    await User.updateMany({}, {
      $pull: {
        messages: msgId
      }
    });

    // Delete message
    await Message.findByIdAndDelete(msgId);

    res.status(204).json();

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
exports.getAllGroupMessages = async (req, res, next) => {
  try {
    const groupName = req.params.name;

    const group = await Group.findOne({
      groupName,
    }).populate({
      path: 'messages',
      populate: {
        path: 'messages'
      },
      select: '-__v -group'
    });

    if (!group) {
      res.status(404).json({
        status: 'fail',
        message: 'Not Found this group with that group name.',
      });
      throw new Error('Not Found this group with that group name.');
    };

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

    // Delete message on user
    const messageUserPromises = messages.map(message => {
      User.updateMany({}, {
        $pull: {
          messages: message
        }
      });
    });
    await Promise.all(messageUserPromises);

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