// const ObjectId = require('mongoose').Types.ObjectId
const Group = require('../models/groupModel');
const User = require('../models/userModel');
const UserRecord = require('../models/userRecordModel');
const Message = require('../models/messageModel');

// Get all group
exports.getAllGroups = async (req, res, next) => {
  try {
    const groups = await Group.find().populate({
      path: 'members',
      populate: {
        path: 'members'
      },
      select: '-__v -messages -userRecords'
    });

    res.status(200).json({
      status: 'success',
      data: groups,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: (err.message)
    });
    throw new Error(err.message);
  }
};

// JSON format of createGroup:
// req.body = {
//   name: "First member",
//   groupName: "Group Name"
// };
exports.createGroup = async (req, res, next) => {
  try {
    const {
      name,
      groupName
    } = req.body;

    const user = await User.findOne({
      name
    });

    if (!user) {
      res.status(400).json({
        status: 'fail',
        message: 'A Group must have an founder.',
      });
      throw new Error('A Group must have an founder.');
    };

    // Check existing user
    const checkUser = await User.findById(user._id);

    if (!checkUser) {
      res.status(404).json({
        status: 'fail',
        message: 'Please log in and get valid userId.',
      });
      throw new Error('Please log in and get valid userId.');
    };

    let group = await Group.create({
      groupName,
      members: [user._id]
    });

    group = await group.populate({
      path: 'members',
      populate: {
        path: 'members'
      },
      select: '-userRecords -currentGroup -messages -active -__v'
    }).execPopulate();

    // Update currentGroup
    await User.findByIdAndUpdate(user._id, {
      currentGroup: group._id,
    });

    res.status(201).json({
      status: 'success',
      data: group
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: (err.message)
    });
    throw new Error(err.message);
  }
};

// Get a group with groupName
exports.getGroup = async (req, res, next) => {
  try {
    const name = req.params.name;

    const group = await Group.findOne({
      groupName: name
    }).populate({
      path: 'messages',
      populate: {
        path: 'messages'
      },
      select: '-__v -group'
    }).populate({
      path: 'members',
      populate: {
        path: 'members'
      },
      select: '-messages -__v -currentGroup -userRecords -active'
    });

    if (!group) {
      res.status(404).json({
        status: 'fail',
        message: 'Not found a group with that name.',
      });
      throw new Error('Not found a group with that name.');
    }

    res.status(200).json({
      status: 'success',
      data: group
    });

  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: (err.message)
    });
    throw new Error(err.message);
  }
};

// Edit group with name: EX. edit groupName NOT kick the member because it has trouble relations!!
exports.updateGroup = async (req, res, next) => {
  try {
    const name = req.params.name;
    // ONLY edit groupName
    const newGroupName = req.body.groupName;

    const group = await Group.findOneAndUpdate({
      groupName: name
    }, {
      groupName: newGroupName,
    }, {
      new: true,
      runValidators: true
    });

    if (!group) {
      res.status(404).json({
        status: 'fail',
        message: 'Not found a group with that name.',
      });
      throw new Error('Not found a group with that name.');
    }

    res.status(200).json({
      status: 'success',
      data: group
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: (err.message)
    });
    throw new Error(err.message);
  }

};

// NOT yet implement
// pass by params or body????
exports.deleteGroup = async (req, res, next) => {
  try {
    const groupName = req.params.name;

    const currentGroup = await Group.findOne({
      groupName
    });

    if (!currentGroup) {
      res.status(404).json({
        status: 'fail',
        message: 'Not found a group with that name.',
      });
      throw new Error('Not found a group with that name.');
    };

    // Delete all messages in group
    const messages = currentGroup.messages;
    const messagePromises = messages.map(id => {
      return Message.deleteMany({
        _id: id
      });
    });
    await Promise.all(messagePromises);

    // Delete all messages in user
    const userMessagePromises = messages.map(id => {
      return User.updateMany({}, {
        $pull: {
          messages: id
        }
      });
    });
    await Promise.all(userMessagePromises);

    // Delete currentGroup with this groupName userModel (Create local function)
    const members = currentGroup.members;
    const memberPromises = members.map(id => {
      return User.findByIdAndUpdate(id, {
        currentGroup: null
      }, {
        new: true
      });
    });
    await Promise.all(memberPromises);

    // Delete all dependencies with groupName in userRecord
    await UserRecord.findByIdAndDelete(currentGroup._id);

    // Delete this group
    await Group.deleteOne({
      groupName
    });

    console.log(`Group ID: "${currentGroup._id}" has been deleted`);
    res.status(204).json();

  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: (err.message)
    });
    throw new Error(err.message);
  }
};