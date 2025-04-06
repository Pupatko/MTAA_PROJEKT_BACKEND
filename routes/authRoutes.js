const express = require('express');
const router = express.Router();
const { refreshToken } = require('../controllers/authController');

router.post('/refresh', refreshToken);

module.exports = router;
