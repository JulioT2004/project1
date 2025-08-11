const express = require('express');
const router = express.Router();

const { login } = require('../controllers/authController');
const validate = require('../middlewares/validate');
const { loginSchema } = require('../schemas/authSchema');

// Endpoint para iniciar sesión
router.post('/', validate(loginSchema), login);

module.exports = router;