const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

router.get('/my-patients', auth, checkRole(['psychologist']), async (req, res) => {
  try {
    const patients = await User.find({ psychologistId: req.user.id })
      .select('name email createdAt') 
      .sort({ createdAt: -1 });
    
    res.json(patients);
  } catch (err) {
    console.error("Помилка на сервері:", err);
    res.status(500).json({ message: "Помилка завантаження пацієнтів" });
  }
});

module.exports = router;