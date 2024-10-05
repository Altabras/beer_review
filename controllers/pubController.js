const db = require('../db');
const multer = require('multer'); // Імпортуємо multer
const path = require('path'); // Імпортуємо path для роботи з файлами

// Налаштування multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Вказуємо папку для зберігання файлів
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Зберігаємо файл з унікальним ім'ям
  },
});

const upload = multer({ storage: storage });

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
  const { name, location, description, rating } = req.body; // Вилучаємо image_url
  const image_url = req.file ? req.file.path : null; // Отримуємо шлях до зображення
  const sql = 'INSERT INTO pubs (name, location, description, rating, image_url) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, location, description, rating, image_url], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.insertId, name, location, description, rating, image_url });
  });
};

exports.updatePub = (req, res) => {
  const { id } = req.params;
  const { name, location, description, rating } = req.body;
  const image_url = req.file ? req.file.path : null; // Отримуємо шлях до нового зображення, якщо є

  let sql;
  let params;

  // Якщо є нове зображення, оновлюємо всі поля, включаючи image_url
  if (image_url) {
    sql = 'UPDATE pubs SET name = ?, location = ?, description = ?, rating = ?, image_url = ? WHERE id = ?';
    params = [name, location, description, rating, image_url, id];
  } else {
    // Якщо зображення немає, оновлюємо всі поля, крім image_url
    sql = 'UPDATE pubs SET name = ?, location = ?, description = ?, rating = ? WHERE id = ?';
    params = [name, location, description, rating, id];
  }

  db.query(sql, params, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ id, name, location, description, rating, image_url });
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


// Отримати список пива для конкретного паба
exports.getBeersByPubId = (req, res) => {
  const { id } = req.params; // Отримуємо ID паба з параметрів
  const sql = `
    SELECT beers.id, beers.name, beers.type, beers.description, beers.rating, beers.beer_img
    FROM beers 
    JOIN pub_beer ON beers.id = pub_beer.beer_id 
    WHERE pub_beer.pub_id = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results); // Повертаємо список пива для конкретного паба
  });
};


