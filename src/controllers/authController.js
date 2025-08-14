const prisma = require('../config/db.js');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const REFRESH_TOKEN_EXPIRATION_DAYS = 7;

function generateRefreshToken(userId) {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: `${REFRESH_TOKEN_EXPIRATION_DAYS}d`,
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  // Validar credenciales
  const user = await prisma.user.findUnique({ where: { email } });

  

  if (!user) {
    return res.status(401).json({ message: 'No existe email' });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if(!validPassword){
return res.status(401).json({ message: 'Contraseña incorrecta' });

  }
  if (!user.isVerified) {
  return res.status(403).json({ error: "Debes verificar tu cuenta antes de iniciar sesión" });
}



  // Access Token
  const accessToken = jwt.sign(
    { userId: user.id , isSuperuser: user.isSuperuser },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '1h' }
  );

  // Refresh Token
  const refreshToken = generateRefreshToken(user.id);

  // Guardar en BD con fecha de expiración
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRATION_DAYS);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt,
    },
  });

  res.json({ accessToken, refreshToken });
}


module.exports = { login };


