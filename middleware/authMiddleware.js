const jwt = require('jsonwebtoken');

// Middleware для перевірки токена
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.sendStatus(401); // Якщо токен відсутній

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) return res.sendStatus(403); // Якщо токен недійсний
        req.user = user;
        next(); // Якщо все добре, передаємо запит далі
    });
}

module.exports = authenticateToken;
