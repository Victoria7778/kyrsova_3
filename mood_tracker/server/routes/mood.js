const express = require('express');
const router = express.Router();
const Mood = require('../models/Mood');
const jwt = require('jsonwebtoken');

// Middleware для перевірки, чи залогінений користувач
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Авторизація відхилена' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Додаємо id користувача до запиту
    next();
  } catch (err) {
    res.status(401).json({ message: 'Токен невалідний' });
  }
};

// POST: Додати новий запис настрою
router.post('/add', auth, async (req, res) => {
  try {
    const newMood = new Mood({
      ...req.body,
      user: req.user.id // Прив'язуємо запис до конкретного користувача
    });
    await newMood.save();
    res.status(201).json({ message: 'Запис успішно створено!' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера при збереженні' });
  }
});

module.exports = router;