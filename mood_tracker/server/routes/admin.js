const express = require('express');
const router = express.Router();
const User = require('../models/User');
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

module.exports = router;

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