const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authenticateToken");
const authorizeSuperUser = require("../middlewares/authorizeSuperUser");
const validate = require("../middlewares/validate");
const { vacationSchema } = require("../schemas/vacationSchema");
const { createVacation , updateVacation , getVacations , getMyVacations} = require("../controllers/vacationController");

router.get("/", authenticateToken, authorizeSuperUser, getVacations);
router.get("/me", authenticateToken, getMyVacations);
router.post("/", authenticateToken, validate(vacationSchema), createVacation);
router.patch("/:id", authenticateToken, authorizeSuperUser , updateVacation);


module.exports = router;
