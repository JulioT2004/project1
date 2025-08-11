import cron from 'node-cron';
import { prisma } from '../config/prisma.js';

// Ejecutar todos los días a medianoche
cron.schedule('0 0 * * *', async () => {
  console.log('🧹 Limpiando refresh tokens expirados...');
  await prisma.refreshToken.deleteMany({
    where: {
      expiresAt: { lt: new Date() },
    },
  });
});

/// para improtarlo en app principal es esto: import './cron/cleanTokens.js';
// pero como usamos commonjs es: