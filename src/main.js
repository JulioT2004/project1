const express = require('express');
require('dotenv').config({path:__dirname + '/.env' });
const app = express();

app.disable('x-powered-by');
app.use(express.json());


// Rutas
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const refreshRoutes = require('./routes/refreshRoutes');
const verifyRoutes = require('./routes/verifyRoutes');
const laptopRoutes = require('./routes/laptopRoutes');
const vacationRoutes = require('./routes/vacationroutes');
app.use('/login', authRoutes);
app.use('/users', userRoutes);
app.use('/refresh-token', refreshRoutes);
app.use('/', verifyRoutes);
app.use('/laptops', laptopRoutes);
app.use('/vacations', vacationRoutes);
const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log('Servidor escuchando en el puerto 3000');
});

