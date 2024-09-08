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

module.exports = router;
