const express = require("express");
const { createUser } = require("../controllers/userController");
const { userSchema } = require("../schemas/userSchema");
const validate = require("../middlewares/validate");

const router = express.Router();

router.post("/", validate(userSchema), createUser);

module.exports = router;