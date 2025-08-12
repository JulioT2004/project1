const express = require('express');
const { refreshToken } = require('../controllers/refreshTokenController.js');

const router = express.Router();

router.post('/', refreshToken);

module.exports = router;
