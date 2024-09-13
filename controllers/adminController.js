const db = require('../db');
const jwt = require('jsonwebtoken');

// Middleware для перевірки ролі адміністратора
exports.checkAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Отримання токену з заголовка авторизації

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token' });
        }

        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        req.userId = decoded.id; // Зберігаємо ID користувача в запиті для подальшого використання
        next(); // Продовжуємо виконання запиту
    });
};

// Функція для отримання всіх пабів
exports.getPubs = (req, res) => {
    const sql = 'SELECT * FROM pubs';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

// Функція для отримання всіх пив
exports.getBeers = (req, res) => {
    const sql = 'SELECT * FROM beers';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};
