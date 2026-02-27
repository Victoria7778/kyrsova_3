const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Mood = require('../models/Mood'); // ОБОВ'ЯЗКОВО ДОДАЙ ЦЕЙ ІМПОРТ
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

// 1. Отримати список усіх користувачів
router.get('/users', auth, checkRole(['admin']), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Помилка завантаження користувачів" });
  }
});

// 2. Оновити роль користувача (user/psychologist/admin)
router.put('/update-role', auth, checkRole(['admin']), async (req, res) => {
  try {
    const { userId, newRole } = req.body;
    const user = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });
    res.json({ message: `Роль користувача ${user.name} змінено на ${newRole}` });
  } catch (err) {
    res.status(500).json({ message: "Помилка оновлення ролі" });
  }
});

// 3. Аудит підключень психологів
router.get('/audit-connections', auth, checkRole(['admin']), async (req, res) => {
  try {
    const psychologists = await User.find({ role: 'psychologist' })
      .select('name email patients')
      .populate('patients', 'name email'); 

    res.json(psychologists);
  } catch (err) {
    res.status(500).json({ message: "Помилка при проведенні аудиту" });
  }
});

// 4. Загальна статистика для головної сторінки адміна
router.get('/stats', auth, checkRole(['admin']), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPsychologists = await User.countDocuments({ role: 'psychologist' });
    
    // Агрегація для підрахунку середнього настрою по всій базі
    const moodStats = await Mood.aggregate([
      { $group: { _id: null, avgMood: { $avg: "$moodScore" } } }
    ]);
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentRegistrations = await User.countDocuments({ createdAt: { $gte: weekAgo } });

    res.json({
      totalUsers,
      totalPsychologists,
      avgSystemMood: moodStats.length > 0 ? moodStats[0].avgMood.toFixed(1) : "0",
      recentRegistrations
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка при зборі статистики" });
  }
});

// Експорт має бути в самому кінці!
module.exports = router;