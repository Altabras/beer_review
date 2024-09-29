const express = require('express');
const router = express.Router();
const pubController = require('../controllers/pubController');
const multer = require('multer');
const path = require('path');

// Налаштування Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Папка для збереження зображень
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

// Отримати всі паби
router.get('/', pubController.getPubs);

// Додати новий паб (з обробкою зображення)
router.post('/', upload.single('image'), pubController.addPub); // Додано upload.single('image')

// Оновити інформацію про паб

router.put('/:id', upload.single('image'), pubController.updatePub);

// Видалити паб
router.delete('/:id', pubController.deletePub);

// Отримати один паб за ID
router.get('/:id', pubController.getPubById);

module.exports = router;
