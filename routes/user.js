const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.delete("/:userId", userController.deleteUser);
router.get("/allusers", userController.getAllUser);
module.exports = router;
