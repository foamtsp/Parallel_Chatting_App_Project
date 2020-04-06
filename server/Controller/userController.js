const User = require('../models/userModel');
const Group = require('../models/groupModel');


//createUser
const createUser = (req, res) => {
    const user = new User({
        name: req.body.name
    })
    user.save(function (err, obj) {
        if (err) {
            res.send(err);
            return;
        }
        else {
            res.json({ message: 'Create User Success', data: obj });
        }
    })
    res.status(201).end()
}

//getUser/name by name or _id? in group model use id เป็นหลัก เลยงงๆ
const getUser = async (req, res) => {
    const { name } = req.params
    try {
        const user = await User.find({ name: name })
        res.json(user)
    } catch (error) {
        res.status(400).json(error)
    }
}

//update  status
const updateStatus = async (req, res) => {
    const { name } = req.params
    const update = req.body
    try {
        await User.findOneAndUpdate({ name: name }, update)
        res.status(200).end()
    } catch (error) {
        res.status(400).json(error)
    }
}

//joinGroup
const joinGroup = async (req, res) => {
    const { name } = req.params
    const groupname = req.body.groupname

    try {
        await Group.findOneAndUpdate({ groupname: groupname }, {
            $push: {
                "members": name // ไม่แน่ใจ มันต้องเป็น schema message?
            }
        })
        await User.findOneAndUpdate({ name: name }, {
            $push: {
                "groups": groupname
            }
        })
        res.status(200).end()
    } catch (error) {
        res.status(400).json(error)
    }
}

//leaveGroup/groupname by name or id?   ไม่รุ้จะ get index จาก groupname มาอัพเดท timestamp ใง 


module.exports = { createUser, getUser, updateStatus, joinGroup }