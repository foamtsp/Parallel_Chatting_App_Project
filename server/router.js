const express = require("express");
const router = express.Router();
const userController = require('./Controller/userController');


router.get("/", (req, res) => {
  res.send({ response: "Server is up and running." }).status(200);
});

router.post("/createuser", controller.createUser)
router.get("/getuser/:name", controller.getUser)
router.put("/update/:name", controller.updateStatus)
router.put("/joingroup/:name", controller.joinGroup)

module.exports = router;