const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Всі запити до адмін-панелі повинні бути авторизовані
router.use(adminController.checkAdmin);

// Роут для отримання всіх пабів
router.get('/pubs', adminController.getPubs);

// Роут для отримання всіх пив
router.get('/beers', adminController.getBeers);

module.exports = router;
