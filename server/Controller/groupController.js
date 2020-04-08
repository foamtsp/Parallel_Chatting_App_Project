const Group = require('../models/groupModel');
const User = require('../models/userModel');
const UserRecord = require('../models/userRecordModel');
const Message = require('../models/messageModel');

// Get all group
exports.getAllGroups = async (req, res, next) => {
  try {
    const groups = await Group.find();

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
      userId,
      groupName
    } = req.body;

    if (!userId) {
      res.status(400).json({
        status: 'fail',
        message: 'A Group must have an founder.',
      });
      throw new Error('A Group must have an founder.');
    }

    const group = await Group.create({
      groupName,
      $set: {
        members: [userId]
      },
    });

    // Update currentGroup
    const user = await User.findByIdAndUpdate(userId, {
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

    // Delete all messages in group (Create local function
    const messages = currentGroup.messages;
    const messagePromises = messages.map(id => {
      Message.findByIdAndRemove(id);
    });
    await Promise.all(messagePromises);

    // Delete currentGroup with this groupName userModel (Create local function)
    const members = currentGroup.members;
    const memberPromises = members.map(id => {
      User.findByIdAndUpdate(id, {
        currentGroup: null
      });
    });
    await Promise.all(memberPromises);

    // Delete all dependencies with groupName in userRecord
    await UserRecord.findByIdAndDelete(currentGroup._id);

    // Delete this group
    await Group.deleteOne({
      groupName
    });

    res.status(204).json({
      status: 'success'
    });

  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: (err.message)
    });
    throw new Error(err.message);
  }
};