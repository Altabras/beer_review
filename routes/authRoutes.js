const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Реєстрація користувача
router.post('/register', authController.register);

// Вхід користувача
router.post('/login', authController.login);

module.exports = router;