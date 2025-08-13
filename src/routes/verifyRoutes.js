const express = require("express");
const prisma = require("../config/db.js");
const generateCode = require("../utils/generateCode");
const { sendEmail } = require("../utils/mailer");

const router = express.Router();

// Esta ruta para enviar el código de verificación
router.post("/send-code", async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: "Usuario no encontrado , correo incorrecto" });

  try {
    const code = generateCode(6);

    // Guardar código con expiración de 60 segundos
    const expiresAt = new Date(Date.now() + 60 * 1000);

    await prisma.verificationCode.create({
      data: {
        userId: user.id,
        code,
        expiresAt
      }
    });

    // Enviar correo
    await sendEmail(email, "Código de verificación", ` <p>Tu código es: <b>${code}</b> </p>`);

    res.json({ message: "Código enviado" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error enviando código" });
  }
});

//Esta ruta para verificar el código
router.post("/verify", async (req, res) => {
  const { email, code } = req.body;
  const user1 = await prisma.user.findUnique({ where: { email } });

  try {
    const verification = await prisma.verificationCode.findFirst({
      where: { userId : user1.id, code }
    });

    if (!verification) {
      return res.status(400).json({ error: "Código inválido" });
    }

    // Verificar expiración
    if (verification.expiresAt < new Date()) {
      await prisma.verificationCode.delete({ where: { id: verification.id } });
      return res.status(400).json({ error: "El código ha expirado" });
    }

    // Marcar usuario como verificado
    await prisma.user.update({
      where: { id: user1.id },
      data: { isVerified: true }
    });

    // Eliminar todos los códigos de ese usuario
    await prisma.verificationCode.deleteMany({
    where: { userId: user1.id }
        });
    

    res.json({ message: "Cuenta verificada correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error verificando código" });
  }
});


module.exports = router;