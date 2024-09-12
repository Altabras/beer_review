const bcrypt = require('bcrypt');

// Ваш пароль
const password = 'qwerty';

// Хешування пароля
const hashedPassword = bcrypt.hashSync(password, 10);

// Виведення хешованого пароля в консоль
console.log('Hashed Password:', hashedPassword);