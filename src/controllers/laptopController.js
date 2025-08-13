const prisma = require('../config/db.js');

async function createLaptop(req, res) {
  try {
    const { id, model, userId } = req.body;
    const laptop = await prisma.laptop.create({
      data: { id, model, userId: userId || null }
    });
    res.status(201).json(laptop);
  } catch (error) {
    res.status(500).json({ error: "Error al crear laptop" });
  }
}

async function getLaptops(req, res) {
  try {
    const laptops = await prisma.laptop.findMany({
      include: { user: {
      select: {
        id: true,
        dni: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        jobTitle: true }}
    }});
    res.json(laptops);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener laptops" });
  }
}

async function updateLaptop(req, res) {
  try {
    const { model, userId } = req.body;
    const laptop = await prisma.laptop.update({
      where: { id: parseInt(req.params.id) },
      data: { model, userId: userId || null }
    });
    res.json(laptop);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar laptop" });
  }
}

async function deleteLaptop(req, res) {
  try {
    await prisma.laptop.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: "Laptop eliminada" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar laptop" });
  }
}

module.exports = { createLaptop, getLaptops, updateLaptop, deleteLaptop };