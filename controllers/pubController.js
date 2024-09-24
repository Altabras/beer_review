const db = require('../db');

// Отримати всі паби
exports.getPubs = (req, res) => {
  const sql = 'SELECT * FROM pubs';
  db.query(sql, (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json(results);
  });
};

// Додати новий паб
exports.addPub = (req, res) => {
  const { name, location, description, rating } = req.body;
  const sql = 'INSERT INTO pubs (name, location, description, rating) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, location, description, rating], (err, result) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: result.insertId, name, location, description, rating });
  });
};

// Оновити інформацію про паб
exports.updatePub = (req, res) => {
  const { id } = req.params;
  const { name, location, description, rating } = req.body;
  const sql = 'UPDATE pubs SET name = ?, location = ?, description = ?, rating = ? WHERE id = ?';
  db.query(sql, [name, location, description, rating, id], (err) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ id, name, location, description, rating });
  });
};

// Видалити паб
exports.deletePub = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM pubs WHERE id = ?';
  db.query(sql, [id], (err) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ message: 'Паб видалено успішно.' });
  });
};

// Отримати один паб за ID
exports.getPubById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM pubs WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Паб не знайдено' });
    }
    res.json(result[0]); // Повертаємо перший результат
  });
};
