const express = require('express');
require('dotenv').config({path:__dirname + '/.env' });
const app = express();

app.disable('x-powered-by');
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: '¡Hola, mundo!'
})});

// Rutas
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const refreshRoutes = require('./routes/refreshRoutes');
const verifyRoutes = require('./routes/verifyRoutes');
app.use('/login', authRoutes);
app.use('/users', userRoutes);
app.use('/refresh-token', refreshRoutes);
app.use('/', verifyRoutes);

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log('Servidor escuchando en el puerto 3000');
});

