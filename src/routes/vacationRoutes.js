const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authenticateToken");
const authorizeSuperUser = require("../middlewares/authorizeSuperUser");
const validate = require("../middlewares/validate");
const { vacationSchema } = require("../schemas/vacationSchema");
const { createVacation , updateVacation , getVacations , getMyVacations} = require("../controllers/vacationController");

router.get("/", authenticateToken, authorizeSuperUser, getVacations);
router.get("/me", authenticateToken, authorizeSuperUser, getMyVacations);
router.post("/", authenticateToken, validate(vacationSchema), createVacation);
router.put("/:id", authenticateToken, authorizeSuperUser , updateVacation);


module.exports = router;