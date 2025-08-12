const express = require("express");
const { createUser } = require("../controllers/userController");
const { userSchema } = require("../schemas/userSchema");
const validate = require("../middlewares/validate");
const authenticateToken = require('../middlewares/authenticateToken');
const prisma = require('../config/db.js'); 

const router = express.Router();

router.post("/register", validate(userSchema), createUser);


router.get('/', authenticateToken, async (req, res) => {
  try {
    const users = await prisma.User.findMany({
      select: { id: true, firstName: true, lastName: true, email: true , jobTitle: true, phone : true , startDate:true }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios' ,error: error.message});
  }
});



module.exports = router;


