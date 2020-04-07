const User = require('../models/userModel');
const UserRecord = require('../models/userRecordModel');
const Group = require('../models/groupModel');

// Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: 'success',
      data: {
        users,
      },
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

// Create user
exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
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
      data: {
        user,
      },
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

// Update user
exports.updateUser = async (req, res, next) => {
  try {
    const name = req.body.name;
    const user = await User.findOneAndUpdate({
        name,
      },
      req.body, {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      res.status(404).json({
        status: 'fail',
        message: 'No user found with that name',
      });
      throw new Error('No user found with that name');
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
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

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

// Before call logout must ALWAYS call leaveGroup together NOT supported auto leaveGroup
exports.logout = async (req, res, next) => {
  try {
    const name = req.params.name;

    await User.findOneAndUpdate({
      name,
    }, {
      active: false,
      loggedoutAt: Date.now(),
    });

    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

// Join group BUT group name must exiting in DB NOT check in this function
exports.joinGroup = async (req, res, next) => {
  try {
    const name = req.params.name;
    const {
      groupName
    } = req.body;

    const user = await User.findOneAndUpdate({
      name,
    }, {
      currentGroup: groupName,
    });

    // push user id in members array
    // EX. ["5c8a22c62f8fb814b56fa18b", "5c8a1f4e2f8fb814b56fa185"]
    await Group.findOneAndUpdate({
      groupName,
    }, {
      $push: {
        members: user._id,
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
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

    // pull user from group member
    const currentGroup = await Group.findOneAndUpdate({
      groupName,
    }, {
      $pull: {
        members: name,
      },
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
    }).populate({
      path: 'userRecords',
      select: '-name',
      model: 'UserRecord',
    });

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};