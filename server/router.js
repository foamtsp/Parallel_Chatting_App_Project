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
// router.post('/users/:name/joingroup', userController.joinGroup);
// router.post('/users/:name/leavegroup', userController.leaveGroup);

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

router
  .route('/groups/:name')
  .get(groupController.getGroup)
  .patch(groupController.updateGroup)
  .delete(groupController.deleteGroup);


// Message routes
router.get('/messages', messageController.getAllMessages);
router
  .route('/messages/:id')
  .get(messageController.getMessage)
  .patch(messageController.editMessage)
  .delete(messageController.deleteMessage);

router
  .route('/groups/:name/message')
  .post(messageController.sendMessage)
  .get(messageController.getAllGroupMessages)
  .delete(messageController.deleteAllGroupMessages);

module.exports = router;