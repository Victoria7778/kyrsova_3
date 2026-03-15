const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Mood = require('../models/Mood'); 
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');
const mongoose = require('mongoose'); 

router.get('/my-patients', auth, checkRole(['psychologist']), async (req, res) => {
  try {
    const patients = await User.find({ psychologistId: req.user.id })
      .select('name email createdAt');

    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0); 
    const endOfToday = new Date();
    endOfToday.setUTCHours(23, 59, 59, 999); 

    const patientsWithActivity = await Promise.all(patients.map(async (patient) => {
      const hasEntryToday = await Mood.exists({ 
        user: patient._id, 
        date: { $gte: startOfToday, $lte: endOfToday } 
      });

      return {
        ...patient._doc,
        hasEntryToday: !!hasEntryToday
      };
    }));

    res.json(patientsWithActivity);
  } catch (err) {
    console.error("ERROR /my-patients:", err.message); //
    res.status(500).json({ message: "Помилка завантаження пацієнтів" });
  }
});

router.get('/patient-stats/:patientId', auth, checkRole(['psychologist']), async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(patientId.trim())) {
      return res.status(400).json({ message: "Некоректний формат ID пацієнта" });
    }


    const cleanId = patientId.trim();

    const patient = await User.findOne({ _id: cleanId, psychologistId: req.user.id });
    
    if (!patient) {
      return res.status(403).json({ message: "Доступ заборонено або пацієнта не знайдено" });
    }

  
    const moods = await Mood.find({ user: cleanId })
      .select('moodScore date -comment') 
      .sort({ date: 1 });

    res.json({ name: patient.name, moods });
  } catch (err) {
    console.error("CRITICAL ERROR in /patient-stats:", err); 
    res.status(500).json({ 
      message: "Помилка завантаження статистики", 
      error: err.message 
    });
  }
});

router.get('/my-specialist', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.psychologistId) return res.json(null);
    
    const psychologist = await User.findById(user.psychologistId).select('name email');
    res.json(psychologist);
  } catch (err) {
    res.status(500).json({ message: "Помилка сервера" });
  }
});

router.get('/find/:id', auth, async (req, res) => {
  try {
    const cleanId = req.params.id.trim();
    if (!mongoose.Types.ObjectId.isValid(cleanId)) {
      return res.status(400).json({ message: "Некоректний формат ID" });
    }

    const psychologist = await User.findOne({ _id: cleanId, role: 'psychologist' }).select('name email'); 
    if (!psychologist) return res.status(404).json({ message: "Психолога не знайдено" });
    
    res.json(psychologist);
  } catch (err) {
    res.status(400).json({ message: "Помилка при пошуку" });
  }
});

router.post('/connect', auth, async (req, res) => {
  try {
    const { psychologistId } = req.body;
    const cleanId = psychologistId.trim();

    const psychologist = await User.findOne({ _id: cleanId, role: 'psychologist' });
    if (!psychologist) return res.status(404).json({ message: "Психолога не знайдено" });

    await User.findByIdAndUpdate(req.user.id, { psychologistId: cleanId });
    res.json({ message: `Ви успішно підключилися до: ${psychologist.name}` });
  } catch (err) {
    res.status(500).json({ message: "Помилка при підключенні" });
  }
});

module.exports = router;