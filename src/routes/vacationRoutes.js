const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authenticateToken");
const validate = require("../middlewares/validate");
const { vacationSchema } = require("../schemas/vacationSchema");
const { createVacation } = require("../controllers/vacationController");

router.post("/", authenticateToken, validate(vacationSchema), createVacation);


module.exports = router;