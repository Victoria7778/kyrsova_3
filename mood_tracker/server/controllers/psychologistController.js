const User = require('../models/User');
const Mood = require('../models/Mood');
const mongoose = require('mongoose');

exports.getMyPatients = async (req, res) => {
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
    res.status(500).json({ message: "Помилка завантаження пацієнтів" });
  }
};

exports.getPatientStats = async (req, res) => {
  try {
    const { patientId } = req.params;
    const cleanId = patientId.trim();

    if (!mongoose.Types.ObjectId.isValid(cleanId)) {
      return res.status(400).json({ message: "Некоректний формат ID" });
    }

    const patient = await User.findOne({ _id: cleanId, psychologistId: req.user.id });
    if (!patient) return res.status(403).json({ message: "Доступ заборонено" });

    const moods = await Mood.find({ user: cleanId })
      .select('moodScore date') 
      .sort({ date: 1 });

    res.json({ name: patient.name, moods });
  } catch (err) {
    res.status(500).json({ message: "Помилка сервера" });
  }
};

exports.findPsychologist = async (req, res) => {
  try {
    const cleanId = req.params.id.trim();
    if (!mongoose.Types.ObjectId.isValid(cleanId)) return res.status(400).json({ message: "ID не валідний" });

    const psychologist = await User.findOne({ _id: cleanId, role: 'psychologist' }).select('name email'); 
    if (!psychologist) return res.status(404).json({ message: "Психолога не знайдено" });
    
    res.json(psychologist);
  } catch (err) {
    res.status(400).json({ message: "Помилка пошуку" });
  }
};

exports.connectToPsychologist = async (req, res) => {
  try {
    const { psychologistId } = req.body;
    const cleanId = psychologistId.trim();
    const psychologist = await User.findOne({ _id: cleanId, role: 'psychologist' });
    if (!psychologist) return res.status(404).json({ message: "Психолога не знайдено" });

    await User.findByIdAndUpdate(req.user.id, { psychologistId: cleanId });
    res.json({ message: `Ви підключилися до: ${psychologist.name}` });
  } catch (err) {
    res.status(500).json({ message: "Помилка підключення" });
  }
};