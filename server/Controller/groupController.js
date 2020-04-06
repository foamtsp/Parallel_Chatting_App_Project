const Group = require('../models/groupModel');

//createGroup
const createGroup = (req, res) => {
  const group = new Group(req.body); //member and message is relation to schema require objectID??
  group.save(function (err, obj) {
    if (err) {
      res.send(err);
      return;
    } else {
      res.json({
        message: 'Create Group Success',
        data: obj,
      });
    }
  });
  res.status(201).end();
};

//getAllGroup
const getAllGroup = (req, res) => {
  try {
    const groups = Group.find({});
    res.json(groups);
  } catch (error) {
    res.status(400).json(error);
  }
};

//addMember

//getAllMember
const getAllGroup = (req, res) => {
  try {
    const memers = Group.find({
      members,
    });
    res.json(memers);
  } catch (error) {
    res.status(400).json(error);
  }
};

//updateMember

//getMessage

//updateMessage

module.exports = {
  createGroup,
  getAllGroup,
};
