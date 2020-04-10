const Group = require('../models/groupModel')
const Message = require('../models/messageModel')
const User = require('../models/userModel')

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

exports.sendMessage = async (name, groupName, message) => {
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