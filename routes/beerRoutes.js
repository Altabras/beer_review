const express = require('express');
const router = express.Router();
const beerController = require('../controllers/beerController');

// Отримати всі сорти пива
router.get('/', beerController.getBeers);

// Додати новий сорт пива
router.post('/', beerController.createBeer);

// Оновити інформацію про пиво
router.put('/:id', beerController.updateBeer);

// Видалити пиво
router.delete('/:id', beerController.deleteBeer);

module.exports = router;
