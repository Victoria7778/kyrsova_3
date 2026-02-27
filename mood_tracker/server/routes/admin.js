const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Mood = require('../models/Mood'); 
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

router.get('/users', auth, checkRole(['admin']), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Помилка завантаження користувачів" });
  }
});

router.put('/update-role', auth, checkRole(['admin']), async (req, res) => {
  try {
    const { userId, newRole } = req.body;
    const user = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });
    res.json({ message: `Роль користувача ${user.name} змінено на ${newRole}` });
  } catch (err) {
    res.status(500).json({ message: "Помилка оновлення ролі" });
  }
});

router.get('/audit-connections', auth, checkRole(['admin']), async (req, res) => {
  try {
    const psychologists = await User.find({ role: 'psychologist' }).select('name email');

    const auditData = await Promise.all(psychologists.map(async (psycho) => {
      const connectedPatients = await User.find({ psychologistId: psycho._id })
        .select('name email');
      
      return {
        _id: psycho._id,
        name: psycho.name,
        email: psycho.email,
        patients: connectedPatients 
      };
    }));

    res.json(auditData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка при проведенні аудиту" });
  }
});

router.get('/stats', auth, checkRole(['admin']), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPsychologists = await User.countDocuments({ role: 'psychologist' });
    
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

module.exports = router;