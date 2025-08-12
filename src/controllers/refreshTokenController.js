const jwt = require('jsonwebtoken');
const prisma = require('../config/db.js'); // aquí asumo que db.js exporta prisma con module.exports

async function refreshToken(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Falta token' });
  }

  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!storedToken) {
    return res.status(403).json({ message: 'Token inválido' });
  }

  // Verificar expiración
  if (new Date() > storedToken.expiresAt) {
    await prisma.refreshToken.delete({ where: { token: refreshToken }});
    return res.status(403).json({ message: 'Token expirado' });
  }

  // Verificar que el JWT sea válido
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }

    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ accessToken: newAccessToken });
  });
}

module.exports = { refreshToken };