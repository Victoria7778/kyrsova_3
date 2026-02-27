const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');
const Mood = require('../models/Mood');

router.get('/my-patients', auth, checkRole(['psychologist']), async (req, res) => {
  try {
    const patients = await User.find({ psychologistId: req.user.id })
      .select('name email createdAt');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const patientsWithActivity = await Promise.all(patients.map(async (patient) => {
      const hasEntryToday = await Mood.exists({ 
        userId: patient._id, 
        date: { $gte: today } 
      });

      return {
        ...patient._doc,
        hasEntryToday: !!hasEntryToday
      };
    }));

    res.json(patientsWithActivity);
  } catch (err) {
    res.status(500).json({ message: "Помилка завантаження" });
  }
});

router.get('/find/:id', auth, async (req, res) => {
  try {
    const psychologist = await User.findOne({ 
      _id: req.params.id, 
      role: 'psychologist' 
    }).select('name email'); 
    
    if (!psychologist) {
      return res.status(404).json({ message: "Психолога з таким ID не знайдено" });
    }
    
    res.json(psychologist);
  } catch (err) {
    res.status(400).json({ message: "Некоректний формат ідентифікатора" });
  }
});

router.post('/connect', auth, async (req, res) => {
  try {
    const { psychologistId } = req.body;

    const psychologist = await User.findOne({ _id: psychologistId, role: 'psychologist' });
    
    if (!psychologist) {
      return res.status(404).json({ message: "Психолога з таким ID не знайдено" });
    }

    await User.findByIdAndUpdate(req.user.id, { psychologistId: psychologistId });

    res.json({ message: `Ви успішно підключилися до фахівця: ${psychologist.name}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка при підключенні" });
  }
});

module.exports = router;