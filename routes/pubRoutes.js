const express = require('express');
const router = express.Router();
const pubController = require('../controllers/pubController');

// Отримати всі паби
router.get('/', pubController.getPubs);

// Додати новий паб
router.post('/', pubController.addPub);

// Оновити інформацію про паб
router.put('/:id', pubController.updatePub);

// Видалити паб
router.delete('/:id', pubController.deletePub);

// Отримати один паб за ID
router.get('/:id', pubController.getPubById); // Додаємо  маршрут отримання пабу по id

module.exports = router;
