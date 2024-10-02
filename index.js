const express = require('express');
const db = require('./db');
const pubRoutes = require('./routes/pubRoutes');   // Маршрути для пабів
const beerRoutes = require('./routes/beerRoutes'); // Маршрути для пива
const authRoutes = require('./routes/authRoutes');
const path = require('path');

const app = express();

// Middleware для обробки JSON
app.use(express.json());

// Middleware для обслуговування статичних файлів
app.use(express.static('private'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Додаємо цей рядок

app.get('/', (req, res) => {
  res.send('Beer Review API is working!');
});

// Використовуємо маршрути
app.use('/api/pubs', pubRoutes);   // Маршрути для пабів
app.use('/api/beers', beerRoutes);  // Маршрути для пива

// Маршрути аутентифікації
app.use('/api/auth', authRoutes);

// Обробка запитів до React
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
