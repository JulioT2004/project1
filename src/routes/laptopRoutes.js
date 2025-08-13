
const express = require("express");
const router = express.Router();

const authenticateToken = require("../middlewares/authenticateToken");
const authorizeSuperUser = require("../middlewares/authorizeSuperUser");
const validate = require("../middlewares/validate");
const { laptopSchema } = require("../schemas/laptopSchema"); 
const {
  createLaptop,
  getLaptops,
  updateLaptop,
  deleteLaptop
} = require("../controllers/laptopController");


// Rutas para laptops
router.post("/", authenticateToken, authorizeSuperUser, validate(laptopSchema), createLaptop);
router.get("/", authenticateToken, authorizeSuperUser, getLaptops);
router.put("/:id", authenticateToken, authorizeSuperUser, updateLaptop);
router.delete("/:id", authenticateToken, authorizeSuperUser, deleteLaptop);

module.exports = router;