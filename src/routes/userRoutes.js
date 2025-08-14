const express = require("express");
const { createUser, getUsers } = require("../controllers/userController");
const { userSchema } = require("../schemas/userSchema");
const validate = require("../middlewares/validate");
const authenticateToken = require('../middlewares/authenticateToken');


const router = express.Router();

router.post("/register", validate(userSchema), createUser);


router.get('/', authenticateToken , getUsers);



module.exports = router;


