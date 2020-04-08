const express = require('express');
const userController = require('./Controller/userController');
const groupController = require('./Controller/groupController');
const messageController = require('./Controller/messageController');

const router = express.Router();

// User routes
router
  .route('/users')
  .get(userController.getAllUsers)
  .post(userController.isSignedup, userController.createUser);

router.get('/users/:name/logout', userController.logout);
router.post('/users/:name/joingroup', userController.joinGroup);
router.post('/users/:name/leavegroup', userController.leaveGroup);

router
  .route('/users/:name')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

// Group routes
router
  .route('/groups')
  .get(groupController.getAllGroups)
  .post(groupController.createGroup);
// router.post('/creategroup', groupController.createGroup);
// router.get('/groups', groupController.getAllGroup);

// Message routes
// router.get('/messages', messageController.getAllGroupMessages);

module.exports = router;