const db = require('../db');

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

// Додати новий сорт пива
exports.createBeer = (req, res) => {
    const { name, type, description, rating } = req.body;
    const sql = 'INSERT INTO beers (name, type, description, rating) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, type, description, rating], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId, name, type, description, rating });
    });
};

// Оновити інформацію про пиво
exports.updateBeer = (req, res) => {
    const { id } = req.params;
    const { name, type, description, rating } = req.body;
    const sql = 'UPDATE beers SET name = ?, type = ?, description = ?, rating = ? WHERE id = ?';
    db.query(sql, [name, type, description, rating, id], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ id, name, type, description, rating });
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
