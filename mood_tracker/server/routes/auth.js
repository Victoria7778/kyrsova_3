const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Реєстрація
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Перевірка, чи існує користувач
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Користувач вже існує' });

    // Хешування пароля
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'Користувача створено успішно' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

// Логін
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Невірні дані' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Невірні дані' });

    // Створення токена
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, email: user.email } });
 } catch (err) {
  console.error("Помилка на сервері:", err); // <--- Цей рядок виведе червону помилку в консоль VS Code
  res.status(500).json({ message: 'Помилка сервераа' });
}
});

module.exports = router;