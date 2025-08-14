const prisma = require("../config/db");
const bcrypt = require("bcrypt");

async function createUser(req, res) {
  try {
    const { dni, email, firstName, lastName, phone, jobTitle, password } = req.validatedData;

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        dni,
        email,
        firstName,
        lastName,
        phone,
        jobTitle,
        password: hashedPassword,
        isSuperuser: false,
        isVerified: false,
        startDate: new Date()
      }
    });

    return res.status(201).json({ message: "Usuario creado con éxito ✅" });
  } catch (error) {

//error de prisma
        if (error.code === 'P2002') {
      const field = Array.isArray(error.meta?.target)
        ? error.meta.target.join(', ')
        : error.meta?.target || 'campo';
      return res.status(400).json({
        message: `El ${field} ya está registrado`,
      });
    }



    // MySQL puro: código de error por duplicado
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        message: 'El usuario ya existe',
      });
    }




    console.error("Error al crear usuario:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function getUsers(req, res) {
  try {
    const users = await prisma.User.findMany({
      select: { id: true, firstName: true, lastName: true, email: true , jobTitle: true, phone : true , startDate:true }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios' ,error: error.message});
  }
}

module.exports = { createUser , getUsers };