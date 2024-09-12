const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Реєстрація користувача
router.post('/register', authController.register);

// Вхід користувача
router.post('/login', authController.login);

// Вхід адміністратора
router.post('/admin-login', authController.adminLogin);

// Перевірка токена
router.get('/verify-token', authController.authenticateToken, authController.verifyToken);



module.exports = router;