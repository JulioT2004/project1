const expres = require('express');
const dotenv = require('dotenv');
const app = expres();

dotenv.config();
app.disable('x-powered-by');

app.get('/', (req, res) => {
  res.json({
    message: '¡Hola, mundo!'
})});

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log('Servidor escuchando en el puerto 3000');
});


