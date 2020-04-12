const User = require('../models/userModel');
const UserRecord = require('../models/userRecordModel');
const Group = require('../models/groupModel');

const {
  getUnreadMessages
} = require('./messageController');

// Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: 'success',
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: (err.message)
    });
    throw new Error(err.message);
  }
};

// Check existing user
exports.isSignedup = async (req, res, next) => {
  try {
    const name = req.body.name;
    const user = await User.findOneAndUpdate({
      name
    }, {
      active: true
    }, {
      new: true
    });

    if (!user) {
      return next();
    };

    console.log(`Existing user, already logged in with id "${user._id}."`);
    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: (err.message)
    });
    throw new Error(err.message);
  };
};

// Create user
exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    console.log(`User has been created with id "${user._id}."`);

    res.status(201).json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: (err.message)
    });
    throw new Error(err.message);
  }
};

// Get user by name
exports.getUser = async (req, res, next) => {
  try {
    const name = req.params.name;
    const user = await User.findOne({
      name,
    });

    if (!user) {
      res.status(404).json({
        status: 'fail',
        message: 'No user found with that name',
      });
      throw new Error('No user found with that name');
    }

    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: (err.message)
    });
    throw new Error(err.message);
  }
};

// Update user
exports.updateUser = async (req, res, next) => {
  try {
    const name = req.params.name;
    const newName = req.body.name;
    const user = await User.findOneAndUpdate({
      name,
    }, {
      name: newName
    }, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      res.status(404).json({
        status: 'fail',
        message: 'No user found with that name',
      });
      throw new Error('No user found with that name');
    }

    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: (err.message)
    });
    throw new Error(err.message);
  }
};

// Delete user by name
exports.deleteUser = async (req, res, next) => {
  try {
    const name = req.params.name;
    const user = await User.findOneAndDelete({
      name,
    });

    if (!user) {
      res.status(404).json({
        status: 'fail',
        message: 'No user found with that name',
      });
      throw new Error('No user found with that name');
    }

    // Delete user id in group
    await Group.updateMany({}, {
      $pull: {
        members: user._id
      }
    });

    // Delete userRecord
    await UserRecord.deleteMany({
      name
    });

    res.status(204).json();
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: (err.message)
    });
    throw new Error(err.message);
  }
};

// Before call logout must ALWAYS call leaveGroup together NOT supported auto leaveGroup
exports.logout = async (req, res, next) => {
  try {
    const name = req.params.name;

    const user = await User.findOneAndUpdate({
      name,
    }, {
      active: false,
      loggedoutAt: Date.now(),
      currentGroup: null
    }, {
      new: true
    });

    if (!user) {
      res.status(400).json({
        status: 'fail',
        message: 'Not found a user with that name'
      })
    };

    // Delete member group
    await Group.updateMany({}, {
      $pull: {
        members: user._id
      }
    })

    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: (err.message)
    });
    throw new Error(err.message);
  }
};

// Join group
exports.joinGroup = async (req, res, next) => {
  try {
    const name = req.params.name;
    const {
      groupName
    } = req.body;

    const group = await Group.findOne({
      groupName,
    });

    if (!group) {
      res.status(404).json({
        status: 'fail',
        message: 'This group name dose not exists.',
      });
      throw new Error('This group name dose not exists.');
    }

    let record = await UserRecord.create({
      name,
      joinAt: new Date(),
      group: group._id
    });

    let readMessages = [];
    let unreadMessages = [];
    if (record.length > 0) {
      [
        readMessages,
        unreadMessages
      ] = await getUnreadMessages(record[record.length - 1], groupName, res);
    }
    const user = await User.findOneAndUpdate({
      name,
    }, {
      currentGroup: group._id,
      readMessages,
      unreadMessages,
      $push: {
        userRecords: record._id,
      }
    }, {
      new: true,
      runValidators: true
    }).populate({
      path: 'readMessages',
      populate: {
        path: 'readMessages'
      }
    }).populate({
      path: 'unreadMessages',
      populate: {
        path: 'unreadMessages'
      }
    });

    // push user id in members array
    // EX. ["5c8a22c62f8fb814b56fa18b", "5c8a1f4e2f8fb814b56fa185"]
    await Group.findOneAndUpdate({
      groupName,
    }, {
      $addToSet: {
        members: user._id
      }
    }, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: (err.message)
    });
    throw new Error(err.message);
  }
};

// Send req.body by group name
exports.leaveGroup = async (req, res, next) => {
  try {
    const name = req.params.name;
    const {
      groupName
    } = req.body;

    const currentUser = await User.findOne({
      name
    });

    // pull user from group
    const group = await Group.findOneAndUpdate({
      groupName
    }, {
      $pull: {
        members: currentUser._id
      }
    });

    const record = await UserRecord.findOne({
      name,
      group: group._id
    })

    const user = await User.findOneAndUpdate({
      name
    }, {
      currentGroup: null,
      readMessages: [],
      unreadMessages: [],
      $pull: {
        userRecords: record._id
      }
    }, {
      new: true
    });

    await UserRecord.findOneAndDelete({
      name,
      group: group._id
    })

    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: (err.message)
    });
    throw new Error(err.message);
  }
};

// Tempolary exit group and save to userRecords
exports.exitGroup = async (req, res, next) => {
  try {
    const name = req.params.name;
    const {
      groupName
    } = req.body;

    const currentUser = await User.findOne({
      name
    });

    const {
      readMessages,
      unreadMessages
    } = currentUser;

    if (!currentUser.currentGroup) {
      res.status(400).json({
        status: 'fail',
        message: 'This user already not in any group.'
      });
      throw new Error('This user already not in any group.');
    };

    const currentGroup = await Group.findOne({
      groupName,
    });

    // save leaveTimeStamp by create default
    const record = await UserRecord.create({
      name,
      group: currentGroup._id
    });

    // push record to user and populate to output
    const user = await User.findOneAndUpdate({
      name,
    }, {
      currentGroup: null,
      $push: {
        userRecords: record._id,
      },
      unreadMessages: [],
      readMessages: [...readMessages, ...unreadMessages]
    }, {
      new: true,
      runValidators: true
    }).populate({
      path: 'userRecords',
      select: '-name',
      model: 'UserRecord',
    });

    res.status(200).json({
      status: 'success',
      data: user,
    });

  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: (err.message)
    });
    throw new Error(err.message);
  }
}