const express = require('express')
const router = express.Router();

const userController = require("../controller/users")

router.post("/signup", userController.signup )
router.post('/login', userController.login)
router.delete("/:userId" ,userController.deleteUser)

module.exports = router;