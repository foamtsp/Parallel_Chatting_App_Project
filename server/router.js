const express = require('express');
const userController = require('./Controller/userController');
const groupController = require('./Controller/groupController');
const messageController = require('./Controller/messageController');

const router = express.Router();

// User routes
router.post('/users', userController.createUser);
// router.get('/getuser/:name', userController.getUser);
// router.put('/update/:name', userController.updateStatus);
// router.put('/joingroup/:name', userController.joinGroup);

// Group routes
// router.post('/creategroup', groupController.createGroup);
// router.get('/groups', groupController.getAllGroup);

// Message routes
// router.get('/messages', messageController.getAllGroupMessages);

module.exports = router;