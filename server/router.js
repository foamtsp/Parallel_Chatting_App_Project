const express = require("express");
const router = express.Router();
const userController = require('./Controller/userController');
const groupController = require('./Controller/groupController');

//user
router.post("/createuser", userController.createUser)
router.get("/getuser/:name", userController.getUser)
router.put("/update/:name", userController.updateStatus)
router.put("/joingroup/:name", userController.joinGroup)

//group
router.post("/creategroup", groupController.createGroup)
router.get("/groups", groupController.getAllGroup)

module.exports = router;