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
app.use('/login', authRoutes);
app.use('/users', userRoutes);


const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log('Servidor escuchando en el puerto 3000');
});


