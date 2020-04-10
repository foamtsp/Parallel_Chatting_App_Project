const Group = require('../models/groupModel')
const Message = require('../models/messageModel')
const User = require('../models/userModel')
const UserRecord = require('../models/userRecordModel');

exports.joinGroup = async (name, groupName) => {
    try {
        const group = await Group.findOne({
            groupName,
        });

        const user = await User.findOneAndUpdate({
            name,
        }, {
            currentGroup: group._id
        }, {
            new: true,
            runValidators: true
        });

        // push user id in members array
        // EX. ["5c8a22c62f8fb814b56fa18b", "5c8a1f4e2f8fb814b56fa185"]
        await Group.findOneAndUpdate({
            groupName,
        }, {
            $addToSet: {
                members: user._id
            }
        });

    } catch (err) {
        throw new Error(err.message);
    }
};

exports.sendMessage = async (name, groupName, message, time) => {
    try {
        // Check existing user
        const user = await User.findOne({
            name
        });
        if (!user) {
            throw new Error('This user name is not correct.');
        };

        // Check this group exists
        const group = await Group.findOne({
            groupName,
        });

        if (!group) {
            throw new Error('Not Found this group with that group name.');
        }

        let newMessage = await Message.create({
            author: user.name,
            group: group._id,
            text: message,
            createdAt:time
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

    } catch (err) {
        throw new Error(err.message);
    }
};

exports.leaveGroup = async (name, groupName) => {
    try {

        const currentUser = await User.findOne({
            name
        });

        if (!currentUser.currentGroup) {
            throw new Error('This user already not in any group.');
        };

        // pull user from group member
        const currentGroup = await Group.findOneAndUpdate({
            groupName,
        }, {
            $pull: {
                members: currentUser._id,
            },
        });

        // save leaveTimeStamp by create default
        const record = await UserRecord.create({
            name,
            group: currentGroup._id,
            leaveTimestamp: Date.now(),
        });

        // push record to user and populate to output
        const user = await User.findOneAndUpdate({
            name,
        }, {
            currentGroup: null,
            $push: {
                userRecords: record._id,
            },
        }, {
            new: true,
            runValidators: true
        }).populate({
            path: 'userRecords',
            select: '-name',
            model: 'UserRecord',
        });

    } catch (err) {
        throw new Error(err.message);
    }
};