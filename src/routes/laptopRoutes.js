
const express = require("express");
const router = express.Router();
const prisma  = require("../config/db.js");
const authenticateToken = require("../middlewares/authenticateToken");
const authorizeSuperUser = require("../middlewares/authorizeSuperUser");

router.post("/", authenticateToken, authorizeSuperUser, async (req, res) => {
  try {
    const {id, model, userId } = req.body;

    const laptop = await prisma.laptop.create({
      data: {
        id ,
        model,
        userId: userId || null, // Puede ser nulo o vacio
      },
    });

    res.status(201).json(laptop);
  } catch (error) {
    res.status(500).json({ error: "Error al crear laptop" });
  }
});

router.get("/", authenticateToken, authorizeSuperUser, async (req, res) => {
  try {
    const laptops = await prisma.laptop.findMany({
      include: {
        user: true, // Trae también la info del usuario si existe
      },
    });
    res.json(laptops);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener laptops" });
  }
});

router.put("/:id", authenticateToken, authorizeSuperUser, async (req, res) => {
  try {
    const { model, userId } = req.body;

    const laptop = await prisma.laptop.update({
      where: { id: parseInt(req.params.id) },
      data: {
        model,
        userId: userId || null,
      },
    });

    res.json(laptop);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar laptop" });
  }
});

// 📌 Eliminar laptop
router.delete("/:id", authenticateToken, authorizeSuperUser, async (req, res) => {
  try {
    await prisma.laptop.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: "Laptop eliminada" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar laptop" });
  }
});

module.exports = router;
