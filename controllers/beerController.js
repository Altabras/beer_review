const db = require('../db');
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
exports.getBeers = (req, res) => {
    const sql = 'SELECT * FROM beers';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

// Додати нове пиво
exports.addBeer = (req, res) => {
    const { name, type, description, rating, pubId } = req.body; // Додано pubId
    const beerImg = req.file ? req.file.path : null; // Отримуємо шлях до зображення

    const sql = 'INSERT INTO beers (name, type, description, rating, beer_img) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, type, description, rating, beerImg], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const beerId = result.insertId; // Отримуємо ID нового пива

        // Додаємо запис до pub_beer для зв'язку
        const pubBeerSql = 'INSERT INTO pub_beer (pub_id, beer_id) VALUES (?, ?)';
        db.query(pubBeerSql, [pubId, beerId], (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Beer added successfully!' });
        });
    });
};

// Оновити інформацію про пиво та змінити паб
exports.updateBeer = (req, res) => {
    const { id } = req.params; // id пива
    const { name, type, description, rating, pubId } = req.body; // Додано pubId
    const beerImg = req.file ? req.file.path : null; // Отримуємо шлях до зображення

    // Оновлюємо дані про пиво
    const sqlBeer = 'UPDATE beers SET name = ?, type = ?, description = ?, rating = ?, beer_img = ? WHERE id = ?';
    
    // Оновлюємо pub_beer
    const sqlPubBeer = 'UPDATE pub_beer SET pub_id = ? WHERE beer_id = ?';

    db.query(sqlBeer, [name, type, description, rating, beerImg, id], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        db.query(sqlPubBeer, [pubId, id], (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(200).json({ id, name, type, description, rating, pubId });
        });
    });
};

// Видалити пиво
exports.deleteBeer = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM beers WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Пиво видалено успішно.' });
    });
};
