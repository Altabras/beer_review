const express = require('express');
const router = express.Router();
const beerController = require('../controllers/beerController');
const multer = require('multer');
const path = require('path');

// Налаштування multer для завантаження зображень
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Куди зберігати завантажені файли
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Генерація унікального імені файлу
    }
});

const upload = multer({ storage: storage });

// Отримати всі сорти пива
router.get('/', beerController.getBeers);

// Додати новий сорт пива (зображення)
router.post('/', upload.single('beer_img'), beerController.addBeer);

// Оновити інформацію про пиво (зображення)
router.put('/:id', upload.single('beer_img'), beerController.updateBeer);

// Видалити пиво
router.delete('/:id', beerController.deleteBeer);



module.exports = router;
